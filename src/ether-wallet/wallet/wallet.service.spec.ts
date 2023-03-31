import { Provider } from '@ethersproject/providers';
import { Test, TestingModule } from '@nestjs/testing';
import { WalletService } from './wallet.service';

describe('WalletService', () => {
  let service: WalletService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WalletService],
    }).compile();

    service = module.get<WalletService>(WalletService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return a provider', () => {
    const provider = service.getProvider('https://testnet.era.zksync.dev');
    expect(provider).toBeInstanceOf(Provider);
  });
});
