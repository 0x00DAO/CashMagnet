import { Inject, Logger } from '@nestjs/common';
import { CommandRunner, Option, SubCommand } from 'nest-commander';
import { WalletService } from '../../ether-wallet/wallet/wallet.service';

@SubCommand({
  name: 'balance',
  arguments: '<address>',
  description: 'query address balance',
})
export class CommandGetBalanceCommander extends CommandRunner {
  @Inject()
  private readonly walletService: WalletService;

  @Option({
    flags: '-r, --rpc-url <url>',
    defaultValue: 'https://testnet.era.zksync.dev',
    description: 'RPC URL eg: https://testnet.era.zksync.dev',
  })
  parseRpcUrl(url: string) {
    if (url) {
      return url;
    }
    return 'https://testnet.era.zksync.dev';
  }

  private readonly logger: Logger = new Logger(CommandGetBalanceCommander.name);
  async run(inputs: string[], options: Record<string, any>): Promise<void> {
    const address = inputs[0];
    this.logger.debug(JSON.stringify(options));
    const rpcUrl = options.rpcUrl;
    const provider = this.walletService.getProvider(rpcUrl);
    const balance = await provider.getBalance(address);
    console.log(
      `address:${address}, balance: ${balance.toString()}, rpcUrl: ${rpcUrl}`
    );
  }
}
