import { Test, TestingModule } from '@nestjs/testing';
import { EtherHdWalletService } from './ether-hd-wallet.service';

describe('EtherHdWalletService', () => {
  let service: EtherHdWalletService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EtherHdWalletService],
    }).compile();

    service = module.get<EtherHdWalletService>(EtherHdWalletService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createHDWallet', () => {
    it('success', () => {
      const wallet = service.createHDWallet();
      expect(wallet).toBeDefined();

      const mnemonic = wallet.mnemonic;
      const wallet2 = service.createHDWallet(mnemonic.phrase);
      expect(wallet2).toBeDefined();

      expect(wallet.address).toEqual(wallet2.address);
    });
  });

  // describe('createHDWalletFromExtendKey', () => {
  //   it('success', () => {
  //     const hdWallet = Wallet.createRandom();
  //     const wallet = service.createHDWalletFromExtendKey(hdWallet.extendedKey);
  //   });
  // });
});
