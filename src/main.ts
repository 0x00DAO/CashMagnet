import { Logger } from '@nestjs/common';
import { CommandFactory } from 'nest-commander';
import { AppModule } from './app.module';
import { APP_VERSION } from './app.version';

async function bootstrap() {
  const logger = new Logger();
  logger.log(`Application StartUp, Version: ${APP_VERSION}`);
  await CommandFactory.run(AppModule, logger);
}
bootstrap();
