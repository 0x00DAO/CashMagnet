import { Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';
import * as dotenvExpand from 'dotenv-expand';

@Injectable()
export class EnvService {
  private envConfig: { [key: string]: string };

  constructor() {
    this.reloadEnv();
  }

  loadEnv() {
    return dotenv.config();
  }

  reloadEnv() {
    const myEnv = this.loadEnv();
    this.envConfig = dotenvExpand.expand(myEnv).parsed;
  }

  get(key: string): string {
    return this.envConfig[key];
  }
}
