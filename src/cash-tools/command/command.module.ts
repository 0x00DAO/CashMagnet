import { Module } from '@nestjs/common';
import { CommandCommander } from './command.commander';

@Module({
  providers: [...CommandCommander.registerWithSubCommands()],
})
export class CommandModule {}
