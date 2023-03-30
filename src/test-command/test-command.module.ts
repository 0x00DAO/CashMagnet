import { Module } from '@nestjs/common';
import { TaskRunner } from './task-runner';

@Module({
  providers: [...TaskRunner.registerWithSubCommands()],
})
export class TestCommandModule {}
