import { Inject } from '@nestjs/common';
import { BigNumber, Wallet, ethers } from 'ethers';
import {
  CommandRunner,
  InquirerService,
  Option,
  SubCommand,
} from 'nest-commander';
import {
  DefaultConfigAccount,
  WalletWithPrivateKey,
} from '../../../configs/default-config-account.interface';
import { Assertion } from '../../../core/exception/assertion';
import { WalletService } from '../../../ether-wallet/wallet/wallet.service';
import { ConfigService } from '../../../utils/config/config.service';
import { ConsoleLoggerService } from '../../../utils/console-logger/console-logger.service';
import { CommandTransferETHAccountType } from './command-transfer-eth.constants';
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

  @Inject()
  private readonly inquirer: InquirerService;

  constructor() {
    super();
  }

  private readonly optionTransferPath: number[] = [0, 1];

  private accountType: CommandTransferETHAccountType =
    CommandTransferETHAccountType.EOA;

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
    if (!this.currentTransferMaxGasFee) {
      this.currentTransferMaxGasFee = await this.getTransferGasFee(provider);
    }
    this.logger.log(`amount: ${amount}`);
    this.logger.log(
      `transfer path: ${transferPath}, count: ${transferPath.length - 1}`
    );
    this.logger.log(
      `current transfer max gas fee: ${ethers.utils.formatEther(
        this.currentTransferMaxGasFee
      )}, total: ${ethers.utils.formatEther(
        this.currentTransferMaxGasFee.mul(transferPath.length - 1)
      )}`
    );

    if (!options.silence) {
      const confirm = await this.inquirer.prompt(
        'continue-confirm-questions',
        undefined
      );
      if (!confirm.confirm) {
        this.logger.log(`🍺 transfer eth canceled!`);
        return;
      }
    }

    this.logger.log(`🍺 begin transfer eth ...`);
    const transferAccountPath = await this.computeTransferAccountPath(
      transferPath,
      accounts
    );
    await this.transferEthByPath(amount, transferAccountPath, provider);
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

  @Option({
    flags: '--s, --silence',
    description: 'silence mode',
  })
  parseSilence(): boolean {
    return true;
  }

  @Option({
    flags: '--a, --account-type <type>',
    description:
      'account type [0:EOA, 1:HDWallet], default is 0: EOA, when account type is HDWallet, from must be 0',
  })
  parseAccountType(
    type: CommandTransferETHAccountType
  ): CommandTransferETHAccountType {
    this.accountType = type;
    return type;
  }

  getProviderWithNetworkConfig(network?: string): ethers.providers.Provider {
    if (!network) {
      network = this.configService.get<string>('cashTools.defaultNetwork');
    }
    this.logger.log(`network: ${network}`);
    const provider = this.walletService.getProviderWithNetworkConfig(network);
    return provider;
  }

  async getAccountByIndex(index: number): Promise<{ privateKey: string }> {
    const commandConfig = this.configService.get<any>(
      'commands.cashTools.transfer-eth'
    );

    const accountFrom = commandConfig.accountFrom ?? 'default';
    const accountTo = commandConfig.accountTo ?? 'default';

    const accountsConfig =
      this.configService.get<DefaultConfigAccount[]>('accounts');

    // only index is 0, use accountFrom
    if (index === 0) {
      const account = accountsConfig.find((a) => a.name === accountFrom);
      Assertion.isNotNil(account, null, `account:${accountFrom} not found`);
      Assertion.isTrue(
        account.type === 'privateKey',
        null,
        `only support privateKey account`
      );
      return account.value[index] as { privateKey: string };
    }

    // index is not 0, use accountTo
    const accountToConfig = accountsConfig.find((a) => a.name === accountTo);
    Assertion.isNotNil(accountToConfig, null, `account:${accountTo} not found`);

    if (accountToConfig.type === 'privateKey') {
      Assertion.isTrue(
        accountToConfig.value.length > index,
        null,
        `account:${accountTo} not found`
      );
      return accountToConfig.value[index] as { privateKey: string };
    } else if (accountToConfig.type === 'hdWallet') {
      const hdWallet = accountToConfig.value as {
        extendedKey: string;
        password: string;
        initialIndex: number;
        count: number;
      };
      //TODO: support hdWallet
      Assertion.isTrue(false, null, `account:${accountTo} not found`);
    } else {
      Assertion.isTrue(false, null, `account:${accountTo} not found`);
    }

    return null;
  }

  getAccountByIndexAndConfig(
    index: number,
    configName: string
  ): WalletWithPrivateKey {
    const accountsConfig =
      this.configService.get<DefaultConfigAccount[]>('accounts');
    const accountConfig = accountsConfig.find((a) => a.name === configName);
    Assertion.isNotNil(accountConfig, null, `account:${configName} not found`);

    if (accountConfig.type === 'privateKey') {
      Assertion.isTrue(
        accountConfig.value.length > index,
        null,
        `account:${configName} not found`
      );
      return accountConfig.value[index] as { privateKey: string };
    } else if (accountConfig.type === 'hdWallet') {
      const hdWallet = accountConfig.value as {
        extendedKey: string;
        password: string;
        initialIndex: number;
        count: number;
      };
      //TODO: support hdWallet
      Assertion.isTrue(false, null, `account:${configName} not found`);
    } else {
      Assertion.isTrue(false, null, `account:${configName} not found`);
    }
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

  async computeTransferAccountPath(
    transferPath: number[],
    accounts: { privateKey: string }[]
  ): Promise<{ privateKey: string }[]> {
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
    const transferAccounts: { privateKey: string }[] = [];
    for (const index of transferPath) {
      const account = accounts[index];
      transferAccounts.push(account);
    }
    return transferAccounts;
  }

  async transferEthByPath(
    amount: string,
    transferAccounts: { privateKey: string }[],
    provider: ethers.providers.Provider
  ) {
    for (let i = 0; i < transferAccounts.length - 1; i++) {
      const logPrefix = `[${i + 1}/${transferAccounts.length - 1}]`;
      this.logger.logPrefix = logPrefix;
      this.logger.log(`transfer ETH begin...`);

      const fromAccount = transferAccounts[i];
      const toAccount = transferAccounts[i + 1];

      const fromPrivateKey = fromAccount.privateKey;
      const toPrivateKey = toAccount.privateKey;

      const tx = await this.transferEth(
        fromPrivateKey,
        toPrivateKey,
        ethers.utils.parseEther(amount),
        provider,
        this.currentTransferMaxGasFee
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
    provider: ethers.providers.Provider,
    maxGasFee?: ethers.BigNumber
  ): Promise<ethers.providers.TransactionResponse> {
    const fromSigner = new Wallet(fromPrivateKey, provider);
    const to = ethers.utils.computeAddress(toPrivateKey);

    if (!maxGasFee) {
      maxGasFee = await this.getTransferGasFee(provider);
    }

    const transferAmount = await this.computeTransferAmount(
      fromSigner.address,
      amount,
      maxGasFee,
      provider
    );

    Assertion.isTrue(
      transferAmount.gt(maxGasFee),
      null,
      `transfer amount must be greater than max gas fee :${ethers.utils.formatEther(
        maxGasFee
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
    provider: ethers.providers.Provider
  ): Promise<ethers.BigNumber> {
    //get gas price
    const gasFeeData = await provider.getFeeData();
    const gasPrice = gasFeeData.maxFeePerGas ?? gasFeeData.gasPrice;
    const gasMaxPriorityFeePerGas =
      gasFeeData.maxPriorityFeePerGas ?? BigNumber.from(0);

    const amount = ethers.utils.parseEther('1');
    //compute gas limit
    // const gasLimit = await provider.estimateGas({
    //   from,
    //   to,
    //   value: amount,
    // });
    const gasLimit = BigNumber.from(21000);

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
