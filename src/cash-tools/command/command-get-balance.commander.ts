import { Inject, Logger } from '@nestjs/common';
import { CommandRunner, Option, SubCommand } from 'nest-commander';
import { DefaultConfigProvider } from '../../configs/default-config-provider.interface';
import { Assertion } from '../../core/exception/assertion';
import { WalletService } from '../../ether-wallet/wallet/wallet.service';
import { ConfigService } from '../../utils/config/config.service';

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
    const network: DefaultConfigProvider = this.getNetwork(options.network);
    const provider = this.walletService.getProvider(network.rpcUrl);
    const balance = await provider.getBalance(address);
    console.log(
      `address:${address}, balance: ${balance.toString()}, rpcUrl: ${
        network.rpcUrl
      }`
    );
  }

  @Option({
    flags: '-network, --network <name>',
    defaultValue: 'mainnet',
    description: 'network name eg: mainnet, testnet, custom',
  })
  parseNetwork(network: string): string {
    return network;
  }

  getNetwork(network: string): DefaultConfigProvider {
    const providers = this.configService.get('providers');
    const provider = providers[network];
    Assertion.isNotNull(provider, null, `network ${network} not found`);
    return provider;
  }
}
