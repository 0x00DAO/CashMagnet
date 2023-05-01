import { Module } from '@nestjs/common';
import { EtherHdWalletModule } from '../ether-wallet/ether-hd-wallet/ether-hd-wallet.module';
import { UtilsModule } from '../utils/utils.module';
import { HdWalletCommander } from './hd-wallet.commander';

@Module({
  imports: [UtilsModule, EtherHdWalletModule],
  providers: [...HdWalletCommander.registerWithSubCommands()],
})
export class HdWalletModule {}
