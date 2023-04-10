import { TestingModule } from '@nestjs/testing';
import { ethers } from 'ethers';
import { CommandTestFactory } from 'nest-commander-testing';
import { WalletService } from '../../ether-wallet/wallet/wallet.service';
import { ConfigService } from '../../utils/config/config.service';
import { CommandGetBalanceCommander } from './command-get-balance.commander';

describe('CommandGetBalanceCommander', () => {
  let module: TestingModule;
  let provider: CommandGetBalanceCommander;
  let walletService: WalletService;

  beforeEach(async () => {
    module = await CommandTestFactory.createTestingCommand({
      imports: [],
      providers: [
        CommandGetBalanceCommander,
        ConfigService,
        {
          provide: WalletService,
          useValue: {
            getProviderWithNetworkConfig: jest
              .fn()
              .mockImplementation((network: string) => {
                return new ethers.providers.JsonRpcProvider(
                  'https://testnet.era.zksync.dev'
                );
              }),
          },
        },
      ],
    }).compile();

    provider = module.get<CommandGetBalanceCommander>(
      CommandGetBalanceCommander
    );
    walletService = module.get<WalletService>(WalletService);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });

  describe('should be getProviderWithNetworkConfig', () => {
    it('get with alias', () => {
      const spyOn = jest.spyOn(walletService, 'getProviderWithNetworkConfig');
      const result = provider.getProviderWithNetworkConfig('testnet-alias');
      expect(result).toBeDefined();
      expect(spyOn).toBeCalledWith('testnet-alias');
    });

    it('get with default', () => {
      const spyOn = jest.spyOn(walletService, 'getProviderWithNetworkConfig');
      const result = provider.getProviderWithNetworkConfig();
      expect(result).toBeDefined();
      expect(spyOn).toBeCalledWith('testnet');
    });
  });
});
