import { Module } from '@nestjs/common';
import { EtherHdWalletModule } from '../../ether-wallet/ether-hd-wallet/ether-hd-wallet.module';
import { WalletModule } from '../../ether-wallet/wallet/wallet.module';
import { ConfigModule } from '../../utils/config/config.module';
import { ConsoleLoggerModule } from '../../utils/console-logger/console-logger.module';
import { CommandGetBalanceCommander } from './command-get-balance.commander';
import { CommandTransferEthCommander } from './command-transfer-eth/command-transfer-eth.commander';
import { ContinueConfirmQuestions } from './command-transfer-eth/questions/continue-confirm-questions';
import { CommandCommander } from './command.commander';

@Module({
  imports: [
    WalletModule,
    ConfigModule,
    ConsoleLoggerModule,
    EtherHdWalletModule,
  ],
  providers: [
    ...CommandCommander.registerWithSubCommands(),
    CommandGetBalanceCommander,
    CommandTransferEthCommander,
    ContinueConfirmQuestions,
  ],
})
export class CommandModule {}
