import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CashToolsModule } from './cash-tools/cash-tools.module';
import { EtherWalletModule } from './ether-wallet/ether-wallet.module';
import { HdWalletModule } from './hd-wallet/hd-wallet.module';
import { ProjectInitialModule } from './project-initial/project-initial.module';
import { TestCommandModule } from './test-command/test-command.module';
import { UtilsModule } from './utils/utils.module';

@Module({
  imports: [
    TestCommandModule,
    HdWalletModule,
    UtilsModule,
    CashToolsModule,
    EtherWalletModule,
    ProjectInitialModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
