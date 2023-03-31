import { Module } from '@nestjs/common';
import { WalletModule } from '../../ether-wallet/wallet/wallet.module';
import { CommandCommander } from './command.commander';
import { CommandGetBalanceCommander } from './command-get-balance.commander';

@Module({
  imports: [WalletModule],
  providers: [...CommandCommander.registerWithSubCommands(), CommandGetBalanceCommander],
})
export class CommandModule {}
