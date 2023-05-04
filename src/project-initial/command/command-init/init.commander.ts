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
      default:
        this.logger.error('Unknown option');
        return;
    }

    this.logger.log(`🎉 Project has been created, location: ${process.cwd()}`);

    return;
  }

  async createWithDefaultYaml(skipOnExists: boolean = false) {
    //if default.yaml exists, do nothing
    const defaultYamlExists = await fs
      .access('default.yaml', fs.constants.F_OK)
      .then(() => true)
      .catch(() => false);

    if (skipOnExists && defaultYamlExists) {
      console.log('💡 default.yaml already exists, do nothing');
      return;
    }

    const contents = DefaultYamlContent;
    //write default.yaml in current directory

    await fs
      .writeFile('default.yaml', contents)
      .then(() => {
        console.log(
          `✅ default.yaml has been ${
            defaultYamlExists ? 'updated' : 'created'
          }!`
        );
      })
      .catch((err) => {
        console.error(err);
      });
  }

  async createWithLocalYaml() {
    //if local.yaml exists, do nothing
    const localYamlExists = await fs
      .access('local.yaml', fs.constants.F_OK)
      .then(() => true)
      .catch(() => false);

    if (localYamlExists) {
      console.log('💡 local.yaml already exists, do nothing');
      return;
    }

    //write local.yaml in current directory
    const contents = LocalYamlContent;
    await fs
      .writeFile('local.yaml', contents)
      .then(() => {
        console.log(`✅ local.yaml has been created`);
      })
      .catch((err) => {
        console.error(err);
      });
  }
}
