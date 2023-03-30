import { Module } from '@nestjs/common';
import { UtilsModule } from '../utils/utils.module';
import { HdWalletCommander } from './hd-wallet.commander';

@Module({
  imports: [UtilsModule],
  providers: [...HdWalletCommander.registerWithSubCommands()],
})
export class HdWalletModule {}
