import { Module } from '@nestjs/common';
import { ConsoleLoggerModule } from '../../utils/console-logger/console-logger.module';
import { InitCommander } from './command-init/init.commander';
import { InitOptionsQuestions } from './command-init/questions/init-options.questions';

@Module({
  imports: [ConsoleLoggerModule],
  providers: [InitCommander, InitOptionsQuestions],
})
export class CommandModule {}
