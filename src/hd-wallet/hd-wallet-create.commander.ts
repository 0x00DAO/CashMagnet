import { Inject } from '@nestjs/common';
import { HDNode } from 'ethers/lib/utils';
import { CommandRunner, SubCommand } from 'nest-commander';
import { EtherHdWalletService } from '../ether-wallet/ether-hd-wallet/ether-hd-wallet.service';

@SubCommand({ name: 'create', arguments: '<password>' })
export class HdWalletCreateCommander extends CommandRunner {
  @Inject()
  private readonly etherHdWalletService: EtherHdWalletService;

  async run(inputs: string[], options: Record<string, any>): Promise<void> {
    const password = inputs[0];
    const { wallet } = this.createHDWallet();

    const extendedKeyEncrypt =
      this.etherHdWalletService.encryptHDWalletExtendedKey(
        wallet.extendedKey,
        password
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

    console.log(logs.join('\n'));
  }

  createHDWallet(): {
    wallet: HDNode;
  } {
    return {
      wallet: this.etherHdWalletService.createHDWallet(),
    };
  }
}
