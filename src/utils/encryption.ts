/**
 * 简单加密工具类
 * 提供 XOR 加密功能
 */

export class SimpleEncryption {
  /**
   * XOR 加密
   * @param text 要加密的文本
   * @param key 加密密钥
   * @returns 加密后的 Base64 字符串
   */
  static xorEncrypt(text: string, key: string): string {
    const textBytes = new TextEncoder().encode(text);
    const keyBytes = new TextEncoder().encode(key);
    const encrypted = new Uint8Array(textBytes.length);

    for (let i = 0; i < textBytes.length; i++) {
      encrypted[i] = textBytes[i] ^ keyBytes[i % keyBytes.length];
    }

    return btoa(String.fromCharCode(...encrypted));
  }

  /**
   * 验证密码强度
   * @param password 要验证的密码
   * @returns 验证结果
   */
  static validatePassword(password: string): { isValid: boolean; message?: string } {
    if (password.length < 4) {
      return { isValid: false, message: '密码长度至少为4位' };
    }
    if (password.length > 50) {
      return { isValid: false, message: '密码长度不能超过50位' };
    }
    return { isValid: true };
  }
}