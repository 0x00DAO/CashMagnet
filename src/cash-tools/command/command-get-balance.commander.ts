import { Inject, Logger } from '@nestjs/common';
import { CommandRunner, Option, SubCommand } from 'nest-commander';
// import { default as ora } from 'ora';
import { ethers } from 'ethers';
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
    const provider = this.walletService.getProviderWithNetworkConfig(
      options.network
    );
    console.log(
      `query balance: address ${address}, RPC URL: ${options.network}`
    );
    console.log(`waiting...`);

    const balance = await provider.getBalance(address);
    console.log(`done! balance: ${ethers.utils.formatEther(balance)}, `);
  }

  @Option({
    flags: '-network, --network <name>',
    defaultValue: 'mainnet',
    description: 'network name eg: mainnet, testnet, custom',
  })
  parseNetwork(network: string): string {
    return network;
  }
}
