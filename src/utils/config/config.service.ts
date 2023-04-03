import { Injectable } from '@nestjs/common';
import config from 'config';

@Injectable()
export class ConfigService {
  get(key: string): string {
    return config.get(key);
  }
}
