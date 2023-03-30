import crypto from 'crypto';
export class Md5Encryption {
  /**
   *  md5取字符串摘要
   * @param data  原字符串
   * @returns 哈希后的摘要
   */
  public static encrypt(data: string): string {
    return crypto.createHash('md5').update(data).digest('hex');
  }

  /**
   * 取字符串md5的前16位
   * @param data
   * @returns
   */
  public static encrypt16(data: string): string {
    return this.encrypt(data).substring(0, 16);
  }
}
