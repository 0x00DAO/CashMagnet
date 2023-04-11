import { Injectable } from '@nestjs/common';
import config from 'config';

@Injectable()
export class ConfigService {
  get<T>(key: string): T {
    return config.get<T>(key);
  }
}
