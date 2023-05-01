import { Module } from '@nestjs/common';
import { EtherHdWalletService } from './ether-hd-wallet.service';

@Module({
  exports: [EtherHdWalletService],
  providers: [EtherHdWalletService],
})
export class EtherHdWalletModule {}
