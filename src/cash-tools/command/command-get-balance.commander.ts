import { Inject, Logger } from '@nestjs/common';
import { CommandRunner, SubCommand } from 'nest-commander';
import { WalletService } from '../../ether-wallet/wallet/wallet.service';

@SubCommand({ name: 'balance', arguments: '<address>', argsDescription: {} })
export class CommandGetBalanceCommander extends CommandRunner {
  @Inject()
  private readonly walletService: WalletService;

  private readonly logger: Logger = new Logger(CommandGetBalanceCommander.name);
  async run(inputs: string[], options: Record<string, any>): Promise<void> {
    const address = inputs[0];
    const provider = this.walletService.getProvider(
      'https://testnet.era.zksync.dev'
    );
    const balance = await provider.getBalance(address);
    this.logger.log(`address:${address}, balance: ${balance.toString()}`);
  }
}
