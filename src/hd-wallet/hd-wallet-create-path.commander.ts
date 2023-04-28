import { Inject, Logger } from '@nestjs/common';
import { HDNode } from 'ethers/lib/utils';
import { CommandRunner, Option, SubCommand } from 'nest-commander';
import { EtherHdWalletService } from '../ether-wallet/ether-hd-wallet/ether-hd-wallet.service';
import { AesEncryption } from '../utils/encryption/aes.encryption';

@SubCommand({ name: 'create-path', arguments: '<extendedKey>' })
export class HdWalletCreatePathCommander extends CommandRunner {
  private readonly logger: Logger = new Logger(
    HdWalletCreatePathCommander.name
  );

  @Inject()
  private readonly etherHdWalletService: EtherHdWalletService;

  private readonly encrypt = new AesEncryption();

  @Option({
    flags: '-a, --account-id <index>',
    defaultValue: 0,
    description: "A account-id index eg: m/44'/60'/account-id'/0/1",
  })
  parseAccount(index: number) {
    return index;
  }

  @Option({
    flags: '-i, --account-index <index>',
    defaultValue: 0,
    description: "A account-id index eg: m/44'/60'/account-id'/0/account-index",
  })
  parseAccountIndex(index: number) {
    return index;
  }

  @Option({
    flags: '-p, --password <password>',
    defaultValue: null,
    description: 'A account-id index eg: 12345678',
  })
  parsePassword(password: string) {
    return password;
  }

  async run(inputs: string[], options: Record<string, any>): Promise<void> {
    const accountId = options.accountId;
    const accountIndex = options.accountIndex;
    const password = options.password;

    const extendedKey = this.etherHdWalletService.decryptHDWalletExtendedKey(
      inputs[0],
      password
    );

    //extendedKey Restore
    const { wallet, path } = await this.createPathWallet(
      extendedKey,
      accountId,
      accountIndex
    ).catch((e) => {
      this.logger.error(e);
      throw e;
    });

    const logs: string[] = [];
    logs.push(`create-path wallet...`);
    logs.push(`address: ${wallet.address}`);
    logs.push(`privateKey: ${wallet.privateKey}`);
    logs.push(`extendedKey: ${wallet.extendedKey}`);

    if (password) {
      logs.push(
        `extendedKeyEncrypt: ${this.encrypt.encryptWithSaltString(
          wallet.extendedKey,
          password,
          password
        )}`
      );
    }

    logs.push(`path depth: ${wallet.depth}`);
    logs.push(`path: ${path}`);
    logs.push(`done.`);

    console.log(logs.join('\n'));
  }

  decodeExtendedKey(extendedKey: string, password: string): string {
    if (!password) {
      return extendedKey;
    }
    const { decrypted } = this.encrypt.decryptWithSaltString(
      extendedKey,
      password
    );
    return decrypted;
  }

  async createPathWallet(
    extendedKey: string,
    accountId: number,
    accountIndex: number
  ): Promise<{ wallet: HDNode; path: string }> {
    const wallet =
      this.etherHdWalletService.createHDWalletFromExtendKey(extendedKey);
    let path = this.getAccountBasePath(accountId) + '/' + accountIndex;
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
  getAccountBasePath(index: number): string {
    return `m/44'/60'/${index}'/0`;
  }
}
