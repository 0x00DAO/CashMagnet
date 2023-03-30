import { TestingModule } from '@nestjs/testing';
import { CommandTestFactory } from 'nest-commander-testing';
import { TaskRunner } from './task-runner';
import { TestCommandModule } from './test-command.module';

describe('TaskRunner', () => {
  let commandInstance: TestingModule;
  let childProcess: TaskRunner;

  beforeAll(async () => {
    commandInstance = await CommandTestFactory.createTestingCommand({
      imports: [TestCommandModule],
    }).compile();
    childProcess = commandInstance.get(TaskRunner);
  });

  it('should call the "run" method', async () => {
    const spawnSpy = jest.spyOn(childProcess, 'run');
    await CommandTestFactory.run(commandInstance, [
      'my-exec',
      'echo Hello World!',
    ]);

    expect(spawnSpy).toHaveBeenCalledTimes(1);
    expect(spawnSpy).toHaveBeenCalledWith(['echo Hello World!'], {});
  });
});
