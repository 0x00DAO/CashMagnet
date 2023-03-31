import { Inject, Logger } from '@nestjs/common';
import { Command, CommandRunner } from 'nest-commander';
import { WalletService } from '../../ether-wallet/wallet/wallet.service';

@Command({
  name: 'cash-tools',
  arguments: '<task>',
  subCommands: [],
  options: { isDefault: false },
  description: 'Cash Tools',
})
export class CommandCommander extends CommandRunner {
  @Inject()
  private readonly walletService: WalletService;

  private readonly logger: Logger = new Logger(CommandCommander.name);
  async run(inputs: string[], options: Record<string, any>): Promise<void> {
    this.logger.log(`CommandCommander: ${JSON.stringify(inputs)}`);
    this.logger.log(`CommandCommander: ${this.walletService.getBalance()}`);
  }
}
