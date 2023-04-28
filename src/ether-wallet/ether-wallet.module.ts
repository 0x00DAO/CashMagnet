import { Module } from '@nestjs/common';
import { WalletModule } from './wallet/wallet.module';
import { EtherHdWalletModule } from './ether-hd-wallet/ether-hd-wallet.module';

@Module({
  imports: [WalletModule, EtherHdWalletModule]
})
export class EtherWalletModule {}
