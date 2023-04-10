import { TestingModule } from '@nestjs/testing';
import { CommandTestFactory } from 'nest-commander-testing';
import { CommandTransferEthCommander } from './command-transfer-eth.commander';
import { CommandModule } from './command.module';

describe('CommandTransferEthCommander', () => {
  let module: TestingModule;
  let provider: CommandTransferEthCommander;

  beforeEach(async () => {
    module = await CommandTestFactory.createTestingCommand({
      imports: [CommandModule],
    }).compile();

    provider = module.get<CommandTransferEthCommander>(
      CommandTransferEthCommander
    );
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });

  it('should call the "run" method', async () => {
    const spawnSpy = jest.spyOn(provider, 'run');
    await CommandTestFactory.run(module, [
      'cash-tools',
      'transfer-eth',
      'from',
      'to',
      '0.1',
    ]);

    expect(spawnSpy).toHaveBeenCalledTimes(1);
    expect(spawnSpy).toHaveBeenCalledWith(['from', 'to', '0.1'], {});
  });

  describe('getAccounts', () => {
    it('should return accounts', () => {
      const accounts = provider.getAccounts();
      expect(accounts.length).toBeGreaterThan(0);

      console.log(accounts);
    });
  });
});
