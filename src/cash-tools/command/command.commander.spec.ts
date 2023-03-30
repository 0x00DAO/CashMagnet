import { TestingModule } from '@nestjs/testing';
import { CommandTestFactory } from 'nest-commander-testing';
import { CommandCommander } from './command.commander';
import { CommandModule } from './command.module';

describe('CommandCommander', () => {
  let module: TestingModule;
  let provider: CommandCommander;

  beforeEach(async () => {
    module = await CommandTestFactory.createTestingCommand({
      imports: [CommandModule],
    }).compile();

    provider = module.get<CommandCommander>(CommandCommander);
  });

  it('should call the "run" method', async () => {
    const spawnSpy = jest.spyOn(provider, 'run');
    await CommandTestFactory.run(module, ['cash-tools', 'echo Hello World!']);

    expect(spawnSpy).toHaveBeenCalledTimes(1);
    expect(spawnSpy).toHaveBeenCalledWith(['echo Hello World!'], {});
  });
});
