import { Module } from '@nestjs/common';
import { EtherHdWalletService } from './ether-hd-wallet.service';

@Module({
  providers: [EtherHdWalletService]
})
export class EtherHdWalletModule {}
