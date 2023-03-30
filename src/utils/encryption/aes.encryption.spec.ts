import { AesEncryption } from './aes.encryption';
describe('AES Encryption', () => {
  let aesEncryption: AesEncryption;
  beforeEach(() => {
    aesEncryption = new AesEncryption();
  });
  it('should encrypt and decrypt a string', () => {
    const plainText = '0x74D748501728cAc09f4b6bc9c989E1854e0af7Df';
    const key = '1112223';
    const encrypted = AesEncryption.encrypt(plainText, key);
    const decrypted = AesEncryption.decrypt(encrypted, key);
    expect(decrypted).toEqual(plainText);
  });

  it('should encrypt and decrypt a string,key error', () => {
    const plainText = '0x74D748501728cAc09f4b6bc9c989E1854e0af7Df';
    const key = '1112223';
    const encrypted = AesEncryption.encrypt(plainText, key);

    expect(() => {
      const key2 = '1112221';
      const decrypted = AesEncryption.decrypt(encrypted, key2);
      expect(decrypted).not.toEqual(plainText);
    }).toThrowError();
  });

  it('should encrypt encryptWithSalt', () => {
    const plainText = '0x74D748501728cAc09f4b6bc9c989E1854e0af7Df';
    const key = '1112223';
    const encrypted = aesEncryption.encryptWithSalt(plainText, key);

    const decrypted = aesEncryption.decryptWithSalt(
      encrypted.crypted,
      key,
      encrypted.salt,
    );
    expect(decrypted).toEqual(plainText);
  });

  it('should encrypt encryptWithSalt,key error', () => {
    const plainText = '0x74D748501728cAc09f4b6bc9c989E1854e0af7Df';
    const key = '1112223';
    const encrypted = aesEncryption.encryptWithSalt(plainText, key);

    expect(() => {
      const key2 = '1112221';
      const decrypted = aesEncryption.decryptWithSalt(
        encrypted.crypted,
        key2,
        encrypted.salt,
      );
      expect(decrypted).not.toEqual(plainText);
    }).toThrowError();
  });

  it('should encrypt encryptWithSalt,salt error', () => {
    const plainText = '0x74D748501728cAc09f4b6bc9c989E1854e0af7Df';
    const key = '1112223';
    const encrypted = aesEncryption.encryptWithSalt(plainText, key);

    expect(() => {
      const salt2 = '1112221';
      const decrypted = aesEncryption.decryptWithSalt(
        encrypted.crypted,
        key,
        salt2,
      );
      expect(decrypted).not.toEqual(plainText);
    }).toThrowError();
  });

  it('should encrypt encryptWithSaltString', () => {
    const plainText = '0x74D748501728cAc09f4b6bc9c989E1854e0af7Df';
    const key = '1112223';
    const encrypted = aesEncryption.encryptWithSaltString(plainText, key);

    const decrypted = aesEncryption.decryptWithSaltString(encrypted);
    expect(decrypted).toEqual({
      key: key,
      salt: expect.any(String),
      decrypted: plainText,
    });
  });

  it('should encrypt encryptWithSaltString,salt error', () => {
    const plainText = '0x74D748501728cAc09f4b6bc9c989E1854e0af7Df';
    const key = '1112223';
    const encrypted = aesEncryption.encryptWithSaltString(plainText, key);

    expect(() => {
      const salt2 = '1112221';
      const decrypted = aesEncryption.decryptWithSaltString(encrypted, salt2);
      expect(decrypted).not.toEqual(plainText);
    }).toThrowError();
  });
});
