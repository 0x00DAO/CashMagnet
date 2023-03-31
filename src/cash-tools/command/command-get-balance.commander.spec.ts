import { TestingModule } from '@nestjs/testing';
import { CommandTestFactory } from 'nest-commander-testing';
import { CommandGetBalanceCommander } from './command-get-balance.commander';
import { CommandModule } from './command.module';

describe('CommandGetBalanceCommander', () => {
  let module: TestingModule;
  let provider: CommandGetBalanceCommander;

  beforeEach(async () => {
    module = await CommandTestFactory.createTestingCommand({
      imports: [CommandModule],
    }).compile();

    provider = module.get<CommandGetBalanceCommander>(
      CommandGetBalanceCommander
    );
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
