import { Module } from '@nestjs/common';
import { CommandModule } from './command/command.module';

@Module({
  imports: [CommandModule]
})
export class ProjectInitialModule {}
