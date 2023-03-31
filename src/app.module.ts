import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HdWalletModule } from './hd-wallet/hd-wallet.module';
import { TestCommandModule } from './test-command/test-command.module';
import { UtilsModule } from './utils/utils.module';
import { CashToolsModule } from './cash-tools/cash-tools.module';
import { EtherWalletModule } from './ether-wallet/ether-wallet.module';

@Module({
  imports: [TestCommandModule, HdWalletModule, UtilsModule, CashToolsModule, EtherWalletModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
