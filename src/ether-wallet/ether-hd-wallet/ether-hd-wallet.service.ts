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

  decryptHDWalletExtendedKey(
    extendedKeyEncrypt: string,
    password: string
  ): string {
    const { decrypted } = this.encrypt.decryptWithSaltString(
      extendedKeyEncrypt,
      password
    );
    return decrypted;
  }

  createHDWalletFromExtendKeyWithEncrypt(
    extendedKeyEncrypt: string,
    password: string
  ): HDNode {
    const decrypted = this.decryptHDWalletExtendedKey(
      extendedKeyEncrypt,
      password
    );
    return this.createHDWalletFromExtendKey(decrypted);
  }

  async createHDWalletByPath(
    hdWallet: HDNode,
    accountId: number,
    accountIndex: number
  ): Promise<{ wallet: HDNode; path: string }> {
    const wallet = hdWallet;
    let path = this.getAccountBasePath(accountId, accountIndex);
    if (wallet.depth !== 0) {
      path = accountIndex.toString();
    }
    return {
      wallet: wallet.derivePath(path),
      path,
    };
  }

  /**
   *
   * @param index
   * @returns
   */
  getAccountBasePath(accountId: number, accountIndex?: number): string {
    let basePath = `m/44'/60'/${accountId}'/0`;
    if (accountIndex !== undefined) {
      basePath += `/${accountIndex}`;
    }
    return basePath;
  }
}
