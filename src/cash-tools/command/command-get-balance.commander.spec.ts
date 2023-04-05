import { TestingModule } from '@nestjs/testing';
import { ethers } from 'ethers';
import { CommandTestFactory } from 'nest-commander-testing';
import { WalletService } from '../../ether-wallet/wallet/wallet.service';
import { ConfigService } from '../../utils/config/config.service';
import { CommandGetBalanceCommander } from './command-get-balance.commander';

describe('CommandGetBalanceCommander', () => {
  let module: TestingModule;
  let provider: CommandGetBalanceCommander;

  beforeEach(async () => {
    module = await CommandTestFactory.createTestingCommand({
      imports: [],
      providers: [
        CommandGetBalanceCommander,
        ConfigService,
        {
          provide: WalletService,
          useValue: {
            getProvider: jest.fn().mockImplementation((rpcUrl: string) => {
              return new ethers.providers.JsonRpcProvider(rpcUrl);
            }),
          },
        },
      ],
    }).compile();

    provider = module.get<CommandGetBalanceCommander>(
      CommandGetBalanceCommander
    );
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
