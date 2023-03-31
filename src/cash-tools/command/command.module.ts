import { Module } from '@nestjs/common';
import { WalletModule } from '../../ether-wallet/wallet/wallet.module';
import { CommandCommander } from './command.commander';

@Module({
  imports: [WalletModule],
  providers: [...CommandCommander.registerWithSubCommands()],
})
export class CommandModule {}
