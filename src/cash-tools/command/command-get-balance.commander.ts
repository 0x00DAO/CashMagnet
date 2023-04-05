import { Inject, Logger } from '@nestjs/common';
import { CommandRunner, Option, SubCommand } from 'nest-commander';
// import { default as ora } from 'ora';
import { ethers } from 'ethers';
import { WalletService } from '../../ether-wallet/wallet/wallet.service';
import { ConfigService } from '../../utils/config/config.service';

// console command:
// product: node dist/main.js cash-tools balance <address>
// default: npx ts-node src/main.ts cash-tools balance <address>
@SubCommand({
  name: 'balance',
  arguments: '<address>',
  description: 'query address balance',
})
export class CommandGetBalanceCommander extends CommandRunner {
  @Inject()
  private readonly walletService: WalletService;

  @Inject()
  private readonly configService: ConfigService;

  private readonly logger: Logger = new Logger(CommandGetBalanceCommander.name);
  async run(inputs: string[], options: Record<string, any>): Promise<void> {
    const address = inputs[0];
    console.log(`query balance begin ...`);
    console.log(`address: ${address}`);
    const provider = this.getProviderWithNetworkConfig(options.network);
    console.log(`waiting...`);

    const balance = await provider.getBalance(address);
    console.log(`balance: ${ethers.utils.formatEther(balance)}`);
    console.log('done.');
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
}
