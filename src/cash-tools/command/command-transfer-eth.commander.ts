import { Inject } from '@nestjs/common';
import { BigNumber, Wallet, ethers } from 'ethers';
import { CommandRunner, Option, SubCommand } from 'nest-commander';
import { DefaultConfigAccount } from '../../configs/default-config-account.interface';
import { Assertion } from '../../core/exception/assertion';
import { WalletService } from '../../ether-wallet/wallet/wallet.service';
import { ConfigService } from '../../utils/config/config.service';
import { ConsoleLoggerService } from '../../utils/console-logger/console-logger.service';

//default: npx ts-node src/main.ts cash-tools transfer-eth 0.1 --from 0 --to 1
//default.2: npx ts-node src/main.ts cash-tools transfer-eth 0.1 --transfer-path 0,1
@SubCommand({
  name: 'transfer-eth',
  arguments: '<amount>',
  description: 'transfer eth',
})
export class CommandTransferEthCommander extends CommandRunner {
  @Inject()
  private readonly walletService: WalletService;

  @Inject()
  private readonly configService: ConfigService;

  @Inject()
  private readonly logger: ConsoleLoggerService;

  private readonly optionTransferPath: number[] = [0, 1];

  /**
   * current transfer max gas fee
   */
  private currentTransferMaxGasFee: BigNumber;

  async run(inputs: string[], options: Record<string, any>): Promise<void> {
    const network = options.network;
    const provider = this.getProviderWithNetworkConfig(network);
    const accounts = this.getAccounts();
    const amount = inputs[0];
    let transferPath = this.optionTransferPath;

    const fromIndex = options.fromAddressIndex;
    const toIndex = options.toAddressIndex;

    if (fromIndex !== undefined && toIndex !== undefined) {
      Assertion.isTrue(
        fromIndex !== toIndex,
        null,
        'from address index and to address index must be different'
      );
      transferPath = [fromIndex, toIndex];
    }

    this.logger.log(`amount: ${amount}`);
    this.logger.log(
      `transfer path: ${transferPath}, count: ${transferPath.length - 1}`
    );
    this.logger.log(`🍺 begin transfer eth ...`);
    await this.transferEthByPath(amount, transferPath, accounts, provider);
    this.logger.log(`🍺 transfer eth done!`);
  }
  @Option({
    flags: '--network, --network <name>',
    description:
      'network name eg: mainnet, testnet, custom, default in config/default.yaml',
  })
  parseNetwork(network: string): string {
    return network;
  }

  @Option({
    flags: '--from, --from-address-index <index>',
    description:
      'network name eg: mainnet, testnet, custom, default in config/default.yaml',
  })
  parseFromAddressIndex(index: number): number {
    return index;
  }

  @Option({
    flags: '--to, --to-address-index <index>',
    description:
      'network name eg: mainnet, testnet, custom, default in config/default.yaml',
  })
  parseToAddress(index: number): number {
    return index;
  }

  @Option({
    flags: '--transfer-path, --transfer-path <path>',
    description:
      'transfer path eg: 0,1,2,0, means transfer from 0 to 1, then 1 to 2, then 2 to 0 \n' +
      'default is 0,1',
  })
  parseTransferPath(index: string): number[] {
    const transferPath = this.getTransferPathIndex(index);
    //clear transfer path
    this.optionTransferPath.splice(0, this.optionTransferPath.length);
    this.optionTransferPath.push(...transferPath);
    return transferPath;
  }

  getProviderWithNetworkConfig(network?: string): ethers.providers.Provider {
    if (!network) {
      network = this.configService.get<string>('cashTools.defaultNetwork');
    }
    this.logger.log(`network: ${network}`);
    const provider = this.walletService.getProviderWithNetworkConfig(network);
    return provider;
  }

  getAccounts(): { privateKey: string }[] {
    const accountConfig = this.configService.get<string>(
      'cashTools.defaultAccount'
    );
    const accounts = this.configService.get<DefaultConfigAccount[]>('accounts');
    const account = accounts.find((a) => a.name === accountConfig);
    Assertion.isNotNil(account, null, `account:${accountConfig} not found`);
    Assertion.isTrue(
      account.type === 'privateKey',
      null,
      `only support privateKey account`
    );
    return account.value as { privateKey: string }[];
  }

  async transferEthByPath(
    amount: string,
    transferPath: number[],
    accounts: { privateKey: string }[],
    provider: ethers.providers.Provider
  ) {
    //check transfer path
    for (const index of transferPath) {
      Assertion.isTrue(
        index < accounts.length,
        null,
        `transfer path index ${index} is out of range`
      );
    }
    const pathValid = this.verifyTransferPath(transferPath);
    Assertion.isTrue(
      pathValid,
      null,
      `transfer path ${transferPath} is not valid`
    );

    for (let i = 0; i < transferPath.length - 1; i++) {
      const logPrefix = `[${i + 1}/${transferPath.length - 1}]`;
      this.logger.logPrefix = logPrefix;
      this.logger.log(`transfer ETH begin...`);

      const fromIndex = transferPath[i];
      const toIndex = transferPath[i + 1];

      const fromPrivateKey = accounts[fromIndex].privateKey;
      const toPrivateKey = accounts[toIndex].privateKey;

      const tx = await this.transferEth(
        fromPrivateKey,
        toPrivateKey,
        ethers.utils.parseEther(amount),
        provider
      );
      this.logger.log(`waiting for tx:${tx.hash} confirm...`);
      const txReceipt = await tx.wait();
      this.logTransaction(tx, txReceipt);
      this.logger.log(`done.\n`);

      this.logger.clearLogPrefix();
    }
  }

  async transferEth(
    fromPrivateKey: string,
    toPrivateKey: string,
    amount: ethers.BigNumber,
    provider: ethers.providers.Provider
  ): Promise<ethers.providers.TransactionResponse> {
    const fromSigner = new Wallet(fromPrivateKey, provider);
    const to = ethers.utils.computeAddress(toPrivateKey);

    if (!this.currentTransferMaxGasFee) {
      this.currentTransferMaxGasFee = await this.getTransferGasFee(
        fromSigner.address,
        to,
        provider
      );
    }

    const transferAmount = await this.computeTransferAmount(
      fromSigner.address,
      amount,
      this.currentTransferMaxGasFee,
      provider
    );

    Assertion.isTrue(
      transferAmount.gt(this.currentTransferMaxGasFee),
      null,
      `transfer amount must be greater than max gas fee :${ethers.utils.formatEther(
        this.currentTransferMaxGasFee
      )}`
    );

    this.logger.log(
      `transfer amount: ${ethers.utils.formatEther(transferAmount)}`
    );
    this.logger.log(`transfer from: ${fromSigner.address} [${fromPrivateKey}]`);
    this.logger.log(`transfer to: ${to} [${toPrivateKey}] `);
    this.logger.log(`begin sendTransaction...`);

    return fromSigner.sendTransaction({
      to,
      value: transferAmount,
    });
  }

  async computeTransferAmount(
    from: string,
    amount: ethers.BigNumber,
    maxFee: ethers.BigNumber,
    provider: ethers.providers.Provider
  ) {
    //get balance
    const fromBalance = await provider.getBalance(from);
    if (fromBalance.lte(amount)) {
      //compute max fee
      return fromBalance.sub(maxFee);
    }
    return amount;
  }

  /**
   * get transfer gas fee
   */
  async getTransferGasFee(
    from: string,
    to: string,
    provider: ethers.providers.Provider
  ): Promise<ethers.BigNumber> {
    //get gas price
    const gasFeeData = await provider.getFeeData();
    const gasPrice = gasFeeData.maxFeePerGas ?? gasFeeData.gasPrice;
    const gasMaxPriorityFeePerGas =
      gasFeeData.maxPriorityFeePerGas ?? BigNumber.from(0);

    const amount = ethers.utils.parseEther('1');
    //compute gas limit
    const gasLimit = await provider.estimateGas({
      from,
      to,
      value: amount,
    });

    this.logger.log(`gasLimit: ${gasLimit.toString()}`);
    //compute max fee
    const maxFee = gasPrice
      .mul(gasLimit)
      .add(gasMaxPriorityFeePerGas.mul(gasLimit));

    return maxFee;
  }

  async logTransaction(
    tx: ethers.providers.TransactionResponse,
    txReceipt: ethers.providers.TransactionReceipt,
    network?: string
  ) {
    if (!network) {
      network = this.configService.get<string>('cashTools.defaultNetwork');
    }
    const provider = this.walletService.getProviderConfig(network);
    let etherscanUrl = provider.blockExplorerUrl;
    //if end with /, remove it
    if (etherscanUrl.endsWith('/')) {
      etherscanUrl = etherscanUrl.slice(0, etherscanUrl.length - 1);
    }
    this.logger.log(`transfer scan: ${etherscanUrl}/tx/${tx.hash}`);
    const gasFee = txReceipt.gasUsed.mul(txReceipt.effectiveGasPrice);
    this.logger.log(`transfer gas fee: ${ethers.utils.formatEther(gasFee)}`);
  }

  getTransferPathIndex(path: string): number[] {
    const orderArr: string[] = path.split(',');
    return orderArr.map((order) => parseInt(order, 10));
  }

  verifyTransferPath(path: number[]): boolean {
    for (let i = 0; i < path.length - 1; i++) {
      if (path[i] === path[i + 1]) {
        return false;
      }
    }
    return true;
  }
}
