import { Module } from '@nestjs/common';
import { EnvModule } from './env/env.module';
import { ConfigModule } from './config/config.module';
import { ConsoleLoggerModule } from './console-logger/console-logger.module';

@Module({
  imports: [EnvModule, ConfigModule, ConsoleLoggerModule]
})
export class UtilsModule {}
