import { TestingModule } from '@nestjs/testing';
import { CommandTestFactory } from 'nest-commander-testing';
import { HdWalletCreateCommander } from './hd-wallet-create.commander';
import { HdWalletModule } from './hd-wallet.module';

describe('HdWalletCreateCommander', () => {
  let commandInstance: TestingModule;
  let childProcess: HdWalletCreateCommander;

  beforeAll(async () => {
    commandInstance = await CommandTestFactory.createTestingCommand({
      imports: [HdWalletModule],
    }).compile();
    childProcess = commandInstance.get(HdWalletCreateCommander);
  });

  it('should call the "run" method', async () => {
    const spawnSpy = jest.spyOn(childProcess, 'run');
    await CommandTestFactory.run(commandInstance, [
      'hd-wallet',
      'create',
      'echo Hello World!',
    ]);

    expect(spawnSpy).toHaveBeenCalledTimes(1);
  });
});
