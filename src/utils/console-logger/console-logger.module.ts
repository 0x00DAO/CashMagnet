import { Global, Module } from '@nestjs/common';
import { ConsoleLoggerService } from './console-logger.service';

@Global()
@Module({
  providers: [ConsoleLoggerService],
  exports: [ConsoleLoggerService],
})
export class ConsoleLoggerModule {}
