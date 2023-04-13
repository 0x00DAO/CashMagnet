import { Module } from '@nestjs/common';
import { ConsoleLoggerService } from './console-logger.service';

@Module({
  providers: [ConsoleLoggerService]
})
export class ConsoleLoggerModule {}
