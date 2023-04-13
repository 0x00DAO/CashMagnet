import { Injectable } from '@nestjs/common';

@Injectable()
export class ConsoleLoggerService {
  private _logPrefix: string = null;

  set logPrefix(value: string) {
    this._logPrefix = value;
  }

  get logPrefix(): string {
    return this._logPrefix;
  }

  clearLogPrefix(): void {
    this._logPrefix = null;
  }

  log(message?: any, ...optionalParams: any[]): void {
    if (this.logPrefix) {
      this.handleLog(this.logPrefix, message, ...optionalParams);
    } else {
      this.handleLog(message, ...optionalParams);
    }
  }

  handleLog(message?: any, ...optionalParams: any[]): void {
    console.log(message, ...optionalParams);
  }
}
