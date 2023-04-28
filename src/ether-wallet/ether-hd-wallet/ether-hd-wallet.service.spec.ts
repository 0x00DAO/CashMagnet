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

  describe('createHDWalletFromExtendKey', () => {
    it('success', () => {
      const hdWallet = service.createHDWallet();
      const wallet = service.createHDWalletFromExtendKey(hdWallet.extendedKey);

      expect(wallet).toBeDefined();
      expect(wallet.address).toEqual(hdWallet.address);
    });
  });

  describe('encryptHDWalletExtendedKey', () => {
    it('success', () => {
      const hdWallet = service.createHDWallet();
      const extendedKeyEncrypt = service.encryptHDWalletExtendedKey(
        hdWallet.extendedKey,
        'password'
      );

      expect(extendedKeyEncrypt).toBeDefined();
      expect(extendedKeyEncrypt).not.toEqual(hdWallet.extendedKey);

      const wallet = service.createHDWalletFromExtendKeyWithEncrypt(
        extendedKeyEncrypt,
        'password'
      );
      expect(wallet).toBeDefined();
      expect(wallet.address).toEqual(hdWallet.address);
    });
  });

  describe('getAccountBasePath', () => {
    it.each([
      [0, 0, "m/44'/60'/0'/0/0"],
      [0, 1, "m/44'/60'/0'/0/1"],
      [0, undefined, "m/44'/60'/0'/0"],
      [1, 0, "m/44'/60'/1'/0/0"],
    ])('success', (accountIndex, addressIndex, expected) => {
      const path = service.getAccountBasePath(accountIndex, addressIndex);
      expect(path).toEqual(expected);
    });
  });
});
