import crypto from 'crypto';
import { Md5Encryption } from './md5.encryption';

export class AesEncryption {
  /**
   * 加密
   * @param data
   * @param key
   */
  public static encrypt(data: string, key: string): string {
    const md5Key = Md5Encryption.encrypt(key);
    const iv = md5Key.substring(3, 19);

    const encrypt = new AesEncryption();
    return encrypt.encryptInstance(data, md5Key, iv);
  }

  /**
   *  解密
   * @param data  加密数据
   * @param key  密钥
   * @returns  解密后的数据
   */
  public static decrypt(data: string, key: string): string {
    const md5Key = Md5Encryption.encrypt(key);
    const iv = md5Key.substring(3, 19);

    const encrypt = new AesEncryption();
    return encrypt.decryptInstance(data, md5Key, iv);
  }

  private encryptInstance(data: string, key: string, iv: string): string {
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    let crypted = cipher.update(data, 'utf8', 'base64');
    crypted += cipher.final('base64');
    return crypted;
  }

  private decryptInstance(data: string, key: string, iv: string): string {
    const cipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    let decrypted = cipher.update(data, 'base64', 'utf8');
    decrypted += cipher.final('utf8');
    return decrypted;
  }

  /**
   * 加密
   * @param data
   * @param key
   */
  public encryptWithSalt(
    data: string,
    key: string,
  ): {
    salt: string;
    crypted: string;
  } {
    // build 8 bytes salt
    const salt = crypto.randomBytes(8).toString('hex');

    const keyWithMd5 = Md5Encryption.encrypt(key);
    const keyWithSalt = Md5Encryption.encrypt(`${keyWithMd5}-s-a-l-t-${salt}`);
    const viWithSalt = Md5Encryption.encrypt(
      `${keyWithMd5}-s-a-l-t-v-i-${salt}`,
    );
    const iv = viWithSalt.substring(4, 4 + 16);
    const crypted = this.encryptInstance(data, keyWithSalt, iv);

    const result = {
      crypted: crypted,
      salt: salt,
    };

    return result;
  }

  decryptWithSalt(data: string, key: string, salt: string) {
    const keyWithMd5 = Md5Encryption.encrypt(key);
    const keyWithSalt = Md5Encryption.encrypt(`${keyWithMd5}-s-a-l-t-${salt}`);
    const viWithSalt = Md5Encryption.encrypt(
      `${keyWithMd5}-s-a-l-t-v-i-${salt}`,
    );
    const iv = viWithSalt.substring(4, 4 + 16);
    const decrypted = this.decryptInstance(data, keyWithSalt, iv);

    return decrypted;
  }

  public encryptWithSaltString(
    data: string,
    key: string,
    saltKey = 'saltKey',
  ): string {
    const crypted = this.encryptWithSalt(data, key);
    const encryptedKey = AesEncryption.encrypt(key, crypted.salt);
    const encryptedSalt = AesEncryption.encrypt(crypted.salt, saltKey);
    const cryptedWithSalt = `${encryptedKey}.${crypted.crypted}.${encryptedSalt}`;
    return cryptedWithSalt;
  }

  public decryptWithSaltString(
    data: string,
    saltKey = 'saltKey',
  ): {
    key: string;
    salt: string;
    decrypted: string;
  } {
    const dataArr = data.split('.');
    const encryptedKey = dataArr[0];
    const crypted = dataArr[1];
    const encryptedSalt = dataArr[2];

    const salt = AesEncryption.decrypt(encryptedSalt, saltKey);
    const key = AesEncryption.decrypt(encryptedKey, salt);

    const decrypted = this.decryptWithSalt(crypted, key, salt);

    const result = {
      key: key,
      salt: salt,
      decrypted: decrypted,
    };
    return result;
  }
}
