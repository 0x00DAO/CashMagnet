import { Logger } from '@nestjs/common';
import { ethers, utils } from 'ethers';
import { HDNode } from 'ethers/lib/utils';
import { CommandRunner, SubCommand } from 'nest-commander';
import { AesEncryption } from '../utils/encryption/aes.encryption';

@SubCommand({ name: 'create', arguments: '<password>' })
export class HdWalletCreateCommander extends CommandRunner {
  private readonly logger: Logger = new Logger(HdWalletCreateCommander.name);
  private readonly encrypt = new AesEncryption();
  async run(inputs: string[], options: Record<string, any>): Promise<void> {
    const password = inputs[0];
    const { wallet } = this.createHDWallet();

    const extendedKeyEncrypt = this.encrypt.encryptWithSaltString(
      wallet.extendedKey,
      password,
      password,
    );

    const logs: string[] = [];

    logs.push(`create new wallet...`);
    logs.push(`### wallet ###`);
    logs.push(`address: ${wallet.address}`);
    logs.push(`extendedKey: ${wallet.extendedKey}`);
    logs.push(`extendedKeyEncrypt: ${extendedKeyEncrypt}`);
    logs.push(`mnemonic phrase: ${wallet.mnemonic.phrase}`);
    logs.push(`privateKey: ${wallet.privateKey}`);
    logs.push(`path: ${wallet.path}`);
    logs.push(`password: ${password}`);
    logs.push(`### done ###`);

    for (const log of logs) {
      this.logger.log(log);
    }
  }

  createHDWallet(): {
    wallet: HDNode;
  } {
    // 生成随机助记词
    const mnemonic = utils.entropyToMnemonic(utils.randomBytes(32));
    return {
      wallet: ethers.utils.HDNode.fromMnemonic(mnemonic),
    };
  }
}
