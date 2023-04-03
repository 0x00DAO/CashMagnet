import { RUNTIME_ERROR } from '../const/common.error.const';
import { Assertion } from './assertion';
import { RuntimeException } from './runtime-exception';

describe('Assertion', () => {
  it('throwError', () => {
    expect(Assertion.throwError).toThrow(RuntimeException);
    try {
      Assertion.throwError();
    } catch (e) {
      expect(e).toBeInstanceOf(RuntimeException);
      expect(e.status).toBe(RUNTIME_ERROR.code);
      expect(e.message).toBe(RUNTIME_ERROR.message);
    }
  });

  it('Assertion.isTrue', () => {
    try {
      expect(Assertion.isTrue(true)).toBeUndefined();
      Assertion.isTrue(false, 1, 'isFalse');
    } catch (e) {
      expect(e).toBeInstanceOf(RuntimeException);
      expect(e.status).toBe(1);
      expect(e.message).toBe('isFalse');
    }
  });
});
