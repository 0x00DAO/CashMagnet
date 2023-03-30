import { Logger } from '@nestjs/common';
import { Command, CommandRunner } from 'nest-commander';

@Command({
  name: 'cash-tools',
  arguments: '<task>',
  subCommands: [],
  options: { isDefault: false },
  description: 'Cash Tools',
})
export class CommandCommander extends CommandRunner {
  private readonly logger: Logger = new Logger(CommandCommander.name);
  async run(inputs: string[], options: Record<string, any>): Promise<void> {
    this.logger.log('CommandCommander', JSON.stringify(inputs), options);
  }
}
