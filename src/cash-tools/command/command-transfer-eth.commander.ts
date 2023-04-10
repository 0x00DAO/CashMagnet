import { Inject } from '@nestjs/common';
import { Wallet, ethers } from 'ethers';
import { CommandRunner, Option, SubCommand } from 'nest-commander';
import { DefaultConfigAccount } from '../../configs/default-config-account.interface';
import { Assertion } from '../../core/exception/assertion';
import { WalletService } from '../../ether-wallet/wallet/wallet.service';
import { ConfigService } from '../../utils/config/config.service';

//console command: node dist/main.js cash-tools transfer-eth from to 0.1
@SubCommand({
  name: 'transfer-eth',
  arguments: '<from> <to> <amount>',
  description: 'transfer eth',
})
export class CommandTransferEthCommander extends CommandRunner {
  @Inject()
  private readonly walletService: WalletService;

  @Inject()
  private readonly configService: ConfigService;

  async run(inputs: string[], options: Record<string, any>): Promise<void> {
    console.log(inputs);
    const network = options.network;
    const provider = this.getProviderWithNetworkConfig(network);

    const [fromAccount, toAccount] = this.getAccounts();
    const fromSigner = new Wallet(fromAccount.privateKey, provider);
    console.log(`from: ${fromSigner.address}`);
    const to = ethers.utils.computeAddress(toAccount.privateKey);
    console.log(`to: ${to}`);
    const amount = ethers.utils.parseEther(inputs[2]);
    console.log(`amount: ${amount}`);

    const tx = await fromSigner.sendTransaction({
      to,
      value: amount,
    });
    await tx.wait();
    console.log(`tx: ${tx.hash}`);
  }
  @Option({
    flags: '-network, --network <name>',
    description:
      'network name eg: mainnet, testnet, custom, default in config/default.yaml',
  })
  parseNetwork(network: string): string {
    return network;
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
}
