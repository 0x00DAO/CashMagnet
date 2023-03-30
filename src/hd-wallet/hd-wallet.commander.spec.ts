import { TestingModule } from '@nestjs/testing';
import { CommandTestFactory } from 'nest-commander-testing';
import { HdWalletCommander } from './hd-wallet.commander';
import { HdWalletModule } from './hd-wallet.module';

describe('HdWalletCommander', () => {
  let commandInstance: TestingModule;
  let childProcess: HdWalletCommander;

  beforeAll(async () => {
    commandInstance = await CommandTestFactory.createTestingCommand({
      imports: [HdWalletModule],
    }).compile();
    childProcess = commandInstance.get(HdWalletCommander);
  });

  it('should call the "run" method', async () => {
    const spawnSpy = jest.spyOn(childProcess, 'run');
    await CommandTestFactory.run(commandInstance, [
      'hd-wallet',
      'echo Hello World!',
    ]);

    expect(spawnSpy).toHaveBeenCalledTimes(1);
    expect(spawnSpy).toHaveBeenCalledWith(['echo Hello World!'], {});
  });
});
