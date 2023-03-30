import { Logger } from '@nestjs/common';
import { CommandFactory } from 'nest-commander';
import { AppModule } from './app.module';
async function bootstrap() {
  await CommandFactory.run(AppModule, new Logger());
}
bootstrap();
