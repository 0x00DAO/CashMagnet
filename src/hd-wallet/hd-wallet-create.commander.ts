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
    logs.push(`====================`);
    logs.push(`Address:             ${wallet.address}`);
    logs.push(`ExtendedKey:         ${wallet.extendedKey}`);
    logs.push(`ExtendedKeyEncrypt:  ${extendedKeyEncrypt}`);
    logs.push(`Mnemonic phrase:     ${wallet.mnemonic.phrase}`);
    logs.push(`PrivateKey:          ${wallet.privateKey}`);
    logs.push(`Path:                ${wallet.path}`);
    logs.push(`Password:            ${password}`);
    logs.push(`====================`);
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
