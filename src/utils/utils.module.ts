import { Module } from '@nestjs/common';
import { EnvModule } from './env/env.module';
import { ConfigModule } from './config/config.module';

@Module({
  imports: [EnvModule, ConfigModule]
})
export class UtilsModule {}
