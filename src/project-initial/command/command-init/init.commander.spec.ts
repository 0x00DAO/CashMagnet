import { TestingModule } from '@nestjs/testing';
import { CommandTestFactory } from 'nest-commander-testing';
import { CommandModule } from '../command.module';
import { InitCommander } from './init.commander';

describe('InitCommander', () => {
  let module: TestingModule;
  let provider: InitCommander;

  beforeEach(async () => {
    module = await CommandTestFactory.createTestingCommand({
      imports: [CommandModule],
    }).compile();

    provider = module.get<InitCommander>(InitCommander);
  });

  it('should call the "run" method', async () => {
    const spawnSpy = jest.spyOn(provider, 'run');
    await CommandTestFactory.run(module, ['init']);

    expect(spawnSpy).toHaveBeenCalledTimes(1);
  });
});
