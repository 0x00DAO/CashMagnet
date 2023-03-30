import { Logger } from '@nestjs/common';
import { Command, CommandRunner } from 'nest-commander';
import { HdWalletCreatePathCommander } from './hd-wallet-create-path.commander';
import { HdWalletCreateCommander } from './hd-wallet-create.commander';

@Command({
  name: 'hd-wallet',
  arguments: '<task>',
  subCommands: [HdWalletCreateCommander, HdWalletCreatePathCommander],
  options: { isDefault: true },
  description: 'HD Wallet Commands',
})
export class HdWalletCommander extends CommandRunner {
  private readonly logger: Logger = new Logger(HdWalletCommander.name);
  async run(inputs: string[], options: Record<string, any>): Promise<void> {
    this.logger.log('HdWalletCommander', JSON.stringify(inputs), options);
  }
}
