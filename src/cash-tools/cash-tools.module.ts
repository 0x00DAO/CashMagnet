import { Module } from '@nestjs/common';
import { CommandModule } from './command/command.module';

@Module({
  imports: [CommandModule],
  providers: [],
})
export class CashToolsModule {}
