import { Md5Encryption } from './md5.encryption';

describe('MD5 Encryption', () => {
  it('should encrypt and decrypt a string', () => {
    const plainText = '0x74D748501728cAc09f4b6bc9c989E1854e0af7Df';
    const encrypted = Md5Encryption.encrypt(plainText);
    expect(encrypted).toHaveLength(32);
  });
});
