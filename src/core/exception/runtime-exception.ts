import { HttpException } from '@nestjs/common';
import { RUNTIME_ERROR } from '../const/common.error.const';

export class RuntimeException extends HttpException {
  private _extendsMsg: string = null;
  public get extendsMsg(): string {
    return this._extendsMsg;
  }
  constructor(
    statusCode: number = RUNTIME_ERROR.code,
    message = RUNTIME_ERROR.message,
    detail = null
  ) {
    super(null, statusCode);
    this.message = message;
    this._extendsMsg = detail;
  }
}
