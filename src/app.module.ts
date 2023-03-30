import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HdWalletModule } from './hd-wallet/hd-wallet.module';
import { TestCommandModule } from './test-command/test-command.module';
import { UtilsModule } from './utils/utils.module';

@Module({
  imports: [TestCommandModule, HdWalletModule, UtilsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
