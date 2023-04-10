import { Inject } from '@nestjs/common';
import { Wallet, ethers } from 'ethers';
import { CommandRunner, Option, SubCommand } from 'nest-commander';
import { DefaultConfigAccount } from '../../configs/default-config-account.interface';
import { Assertion } from '../../core/exception/assertion';
import { WalletService } from '../../ether-wallet/wallet/wallet.service';
import { ConfigService } from '../../utils/config/config.service';

//default: npx ts-node src/main.ts cash-tools transfer-eth 0.1 --from 0 --to 1
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

  async run(inputs: string[], options: Record<string, any>): Promise<void> {
    const network = options.network;
    const provider = this.getProviderWithNetworkConfig(network);

    const fromIndex = options.fromAddressIndex;
    const toIndex = options.toAddressIndex;

    Assertion.isTrue(
      fromIndex !== toIndex,
      null,
      'from address index and to address index must be different'
    );

    const accounts = this.getAccounts();
    const fromPrivateKey = accounts[fromIndex].privateKey;
    const toPrivateKey = accounts[toIndex].privateKey;

    const amount = inputs[0];
    const tx = await this.transferEth(
      fromPrivateKey,
      toPrivateKey,
      ethers.utils.parseEther(amount),
      provider
    );
    console.log(`tx: ${tx.hash}`);
    console.log('waiting for tx confirm...');
    await tx.wait();
    console.log('done.');
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
    defaultValue: 0,
    description:
      'network name eg: mainnet, testnet, custom, default in config/default.yaml',
  })
  parseFromAddressIndex(index: number): number {
    return index;
  }

  @Option({
    flags: '--to, --to-address-index <index>',
    defaultValue: 1,
    description:
      'network name eg: mainnet, testnet, custom, default in config/default.yaml',
  })
  parseToAddress(index: number): number {
    return index;
  }

  getProviderWithNetworkConfig(network?: string): ethers.providers.Provider {
    if (!network) {
      network = this.configService.get<string>('cashTools.defaultNetwork');
    }
    console.log(`network: ${network}`);
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

  async transferEth(
    fromPrivateKey: string,
    toPrivateKey: string,
    amount: ethers.BigNumber,
    provider: ethers.providers.Provider
  ): Promise<ethers.providers.TransactionResponse> {
    const fromSigner = new Wallet(fromPrivateKey, provider);
    const to = ethers.utils.computeAddress(toPrivateKey);

    console.log(`Transfer Amount: ${ethers.utils.formatEther(amount)}`);
    console.log(`Transfer From: ${fromSigner.address} [${fromPrivateKey}]`);
    console.log(`Transfer To: ${to} [${toPrivateKey}] `);

    console.log(`Begin transfer...`);

    return fromSigner
      .sendTransaction({
        to,
        value: amount,
      })
      .then((tx) => {
        console.log(`Transfer tx: ${tx.hash}`);
        return tx;
      });
  }
}
