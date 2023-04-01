import { Injectable } from '@nestjs/common';
import config from 'config';

@Injectable()
export class ConfigService {
  get(key: string): string {
    console.log(config);
    return config.get(key);
  }
}
