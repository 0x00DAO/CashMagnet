import lodash from 'lodash';
import { CommonError, RUNTIME_ERROR } from '../const/common.error.const';
import { RuntimeException } from './runtime-exception';

const errorFunc = (code?: CommonError | number | null, message?: string) => {
  let msg = message ?? RUNTIME_ERROR.message;
  let status = RUNTIME_ERROR.code;
  if (code === null || code === undefined) {
    status = RUNTIME_ERROR.code;
  } else if (typeof code === 'object') {
    status = code.code;
    msg = code['message'];
  } else {
    status = code;
  }
  throw new RuntimeException(status, msg);
};

export class Assertion {
  /**
   * 抛出异常
   * @param code
   * @param message
   */
  static throwError(
    code?: CommonError | number | null,
    message?: string,
  ): void {
    errorFunc(code, message);
  }

  static isTrue(
    value: boolean,
    code?: CommonError | number | null,
    message?: string,
  ): void {
    if (!value) {
      errorFunc(code, message);
    }
  }

  static isFalse(
    value: boolean,
    code?: CommonError | number | null,
    message?: string,
  ): void {
    if (value) {
      errorFunc(code, message);
    }
  }

  static isNotNull(
    value: any,
    code?: CommonError | number | null,
    message?: string,
  ): void {
    if (value === null) {
      errorFunc(code, message);
    }
  }

  static isNotNil(
    value: any,
    code?: CommonError | number | null,
    message?: string,
  ): void {
    if (value === null || value === undefined) {
      errorFunc(code, message);
    }
  }

  static isNil(
    value: any,
    code?: number | null | CommonError,
    message?: string,
  ): void {
    if (value !== null && value !== undefined) {
      errorFunc(code, message);
    }
  }

  /**
   * 验证字符串是否合法
   * @param value
   * @param code
   * @param message
   */
  static isNotEmpty(
    value: string | undefined | null,
    code?: CommonError | number | null,
    message?: string,
  ): void {
    if (!lodash.isString(value) || value.length === 0) {
      errorFunc(code, message);
    }
  }

  /**
   * 验证是否对象中包含某个属性
   * @param value
   * @param map
   * @param code
   * @param message
   */
  static hasProperty(
    value: string,
    map: any,
    code?: CommonError | number | null,
    message?: string,
  ): void {
    if (!map || !map[value]) {
      errorFunc(code, message);
    }
  }

  static isEqual(
    value: any,
    compare: any,
    code?: CommonError | number | null,
    message?: string,
  ): void {
    if (value !== compare) {
      errorFunc(code, message);
    }
  }

  static isNotEqual(
    value: any,
    compare: any,
    code?: CommonError | number | null,
    message?: string,
  ): void {
    if (value === compare) {
      errorFunc(code, message);
    }
  }
}
