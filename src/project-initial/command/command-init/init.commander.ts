import { Inject } from '@nestjs/common';
import * as fs from 'fs/promises';
import { Command, CommandRunner, InquirerService } from 'nest-commander';
import { ConsoleLoggerService } from '../../../utils/console-logger/console-logger.service';
import {
  DefaultYamlContent,
  LocalYamlContent,
} from './init.commander.constants';

@Command({
  name: 'init',
  options: { isDefault: false },
  description: 'Init CashMagnet',
})
export class InitCommander extends CommandRunner {
  @Inject()
  private readonly logger: ConsoleLoggerService;

  @Inject()
  private readonly inquirer: InquirerService;

  async run(inputs: string[], options: Record<string, any>): Promise<void> {
    const selected = await this.inquirer.prompt(
      'init-options-questions',
      undefined
    );

    switch (selected.selected) {
      case 'create-default':
        await this.createWithDefaultYaml(true);
        await this.createWithLocalYaml();
        break;
      case 'create-or-update-default':
        await this.createWithDefaultYaml();
        await this.createWithLocalYaml();
        break;
      case 'update-default':
        await this.createWithDefaultYaml();
        break;
      default:
        this.logger.error('Unknown option');
        return;
    }

    this.logger.log(`🎉 Project has been created, location: ${process.cwd()}`);

    return;
  }

  async createConfigDir() {
    //if directory config does not exist, create it
    const configDirExists = await fs
      .access('config', fs.constants.F_OK)
      .then(() => true)
      .catch(() => false);

    if (!configDirExists) {
      await fs
        .mkdir('config')
        .then(() => {
          console.log('✅ config directory has been created!');
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }

  async createWithDefaultYaml(skipOnExists: boolean = false) {
    const filePath = 'config/default.yaml';
    //if default.yaml exists, do nothing
    const defaultYamlExists = await fs
      .access(filePath, fs.constants.F_OK)
      .then(() => true)
      .catch(() => false);

    if (skipOnExists && defaultYamlExists) {
      console.log('💡 ${filePath} already exists, do nothing');
      return;
    }

    await this.createConfigDir();

    const contents = DefaultYamlContent;
    //write default.yaml in current directory

    await fs
      .writeFile(filePath, contents)
      .then(() => {
        console.log(
          `✅ ${filePath} has been ${
            defaultYamlExists ? 'updated' : 'created'
          }!`
        );
      })
      .catch((err) => {
        console.error(err);
      });
  }

  async createWithLocalYaml() {
    const filePath = 'config/local.yaml';
    //if local.yaml exists, do nothing
    const localYamlExists = await fs
      .access(filePath, fs.constants.F_OK)
      .then(() => true)
      .catch(() => false);

    if (localYamlExists) {
      console.log('💡 ${filePath} already exists, do nothing');
      return;
    }

    await this.createConfigDir();

    //write local.yaml in current directory eg config/local.yaml

    const contents = LocalYamlContent;
    await fs
      .writeFile(filePath, contents)
      .then(() => {
        console.log(`✅ ${filePath} has been created`);
      })
      .catch((err) => {
        console.error(err);
      });
  }
}
