import { Inject } from '@nestjs/common';
import { Command, CommandRunner, InquirerService } from 'nest-commander';
import { ConsoleLoggerService } from '../../../utils/console-logger/console-logger.service';

@Command({
  name: 'init',
  options: { isDefault: false },
  description: 'Init CashMagnet',
})
export class InitCommander extends CommandRunner {
  @Inject()
  private readonly logger: ConsoleLoggerService;

  @Inject()
  private readonly inquirer: InquirerService;

  async run(inputs: string[], options: Record<string, any>): Promise<void> {
    console.log(`CommandCommander: ${JSON.stringify(inputs)}`);

    const confirm = await this.inquirer.prompt(
      'init-options-questions',
      undefined
    );
  }
}
