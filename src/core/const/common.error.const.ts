/**
 * 通用错误格式
 */
export interface CommonError {
  code: number;
  message: string;
}

// db、缓存相关
export const CACHE_SET_ERROR = {
  code: 20001,
  message: 'catchSetError',
};

/**
 * 远程接口调用异常
 */
export const RPC_METHOD_CALL_FAILED = {
  code: 30001,
  message: 'rpcMethodCallFailed',
};

/**
 * 运行时异常
 */
export const RUNTIME_ERROR = {
  code: 50001,
  message: 'runtimeError',
};

/**
 * 运行时异常:请求过多
 */
export const RUNTIME_ERROR_TOO_MANY_REQUESTS = {
  code: 50002,
  message: 'Too Many Requests',
};

/**
 * 运行时异常
 */
export const RUNTIME_ERROR_SERVICE_CLOSE = {
  code: 50003,
  message: 'Service is closed',
};

export const REFRESH_TOKEN_NOT_EXIST = {
  code: 60001,
  message: 'refreshTokenNotExist',
};

export const REFRESH_TOKEN_DECODE_ERROR = {
  code: 60002,
  message: 'refreshTokenDecodeError',
};

export const REFRESH_TOKEN_EXPIRED = {
  code: 60003,
  message: 'refreshTokenExpired',
};

export const REFRESH_TOKEN_NOT_MATCH = {
  code: 60004,
  message: 'refreshTokenNotMatch',
};

/**
 * jwt解析失败
 */
export const TOKEN_DECODE_ERROR = {
  code: 60005,
  message: 'tokenDecodeError',
};
