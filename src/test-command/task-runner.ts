import { Logger } from '@nestjs/common';
import { Command, CommandRunner } from 'nest-commander';

@Command({
  name: 'my-exec',
  arguments: '<task>',
  description: 'Example of a command',
})
export class TaskRunner extends CommandRunner {
  private readonly logger: Logger = new Logger(TaskRunner.name);
  async run(inputs: string[], options: Record<string, any>): Promise<void> {
    this.logger.log('my-exec', JSON.stringify(inputs), options);
  }
}
