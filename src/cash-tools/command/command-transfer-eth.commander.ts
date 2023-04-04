import { CommandRunner, SubCommand } from 'nest-commander';

@SubCommand({
  name: 'transfer-eth',
  arguments: '<from> <to> <amount>',
  description: 'transfer eth',
})
export class CommandTransferEthCommander extends CommandRunner {
  async run(inputs: string[], options: Record<string, any>): Promise<void> {
    console.log(inputs);
  }
}
