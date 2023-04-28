import { Injectable } from '@nestjs/common';
import { ethers, utils } from 'ethers';
import { HDNode } from 'ethers/lib/utils';

@Injectable()
export class EtherHdWalletService {
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
}
