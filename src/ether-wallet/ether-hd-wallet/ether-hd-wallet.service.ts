import { Injectable } from '@nestjs/common';
import { ethers, utils } from 'ethers';
import { HDNode } from 'ethers/lib/utils';
import { AesEncryption } from '../../utils/encryption/aes.encryption';

@Injectable()
export class EtherHdWalletService {
  private readonly encrypt = new AesEncryption();

  createHDWallet(mnemonic?: string): HDNode {
    if (!mnemonic) {
      // 生成随机助记词
      mnemonic = utils.entropyToMnemonic(utils.randomBytes(32));
    }
    const wallet = ethers.utils.HDNode.fromMnemonic(mnemonic);
    return wallet;
  }

  createHDWalletFromExtendKey(extendedKey: string): HDNode {
    const wallet = HDNode.fromExtendedKey(extendedKey);
    return wallet;
  }

  encryptHDWalletExtendedKey(extendedKey: string, password: string): string {
    const extendedKeyEncrypt = this.encrypt.encryptWithSaltString(
      extendedKey,
      password,
      password
    );
    return extendedKeyEncrypt;
  }

  createHDWalletFromExtendKeyWithEncrypt(
    extendedKeyEncrypt: string,
    password: string
  ): HDNode {
    const { decrypted } = this.encrypt.decryptWithSaltString(
      extendedKeyEncrypt,
      password
    );
    return this.createHDWalletFromExtendKey(decrypted);
  }
}
