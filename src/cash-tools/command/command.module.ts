import { Module } from '@nestjs/common';
import { WalletModule } from '../../ether-wallet/wallet/wallet.module';
import { ConfigModule } from '../../utils/config/config.module';
import { CommandGetBalanceCommander } from './command-get-balance.commander';
import { CommandCommander } from './command.commander';

@Module({
  imports: [WalletModule, ConfigModule],
  providers: [
    ...CommandCommander.registerWithSubCommands(),
    CommandGetBalanceCommander,
  ],
})
export class CommandModule {}
