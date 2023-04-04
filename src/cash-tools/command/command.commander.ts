import { Logger } from '@nestjs/common';
import { Command, CommandRunner } from 'nest-commander';
import { CommandGetBalanceCommander } from './command-get-balance.commander';
import { CommandTransferEthCommander } from './command-transfer-eth.commander';

@Command({
  name: 'cash-tools',
  arguments: '<task>',
  subCommands: [CommandGetBalanceCommander, CommandTransferEthCommander],
  options: { isDefault: false },
  description: 'Cash Tools',
})
export class CommandCommander extends CommandRunner {
  private readonly logger: Logger = new Logger(CommandCommander.name);
  async run(inputs: string[], options: Record<string, any>): Promise<void> {
    this.logger.log(`CommandCommander: ${JSON.stringify(inputs)}`);
  }
}
