import { ConsoleLogger } from '@nestjs/common';
import { CommandFactory } from 'nest-commander';
import { AppModule } from './app.module';
import { APP_VERSION } from './app.version';

async function bootstrap() {
  const logger = new ConsoleLogger();
  logger.log(`Application StartUp, Version: ${APP_VERSION}`);
  // await CommandFactory.run(AppModule, logger);
  await CommandFactory.run(AppModule);
}
bootstrap();
