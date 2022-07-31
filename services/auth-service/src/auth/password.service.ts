import {Injectable} from '@nestjs/common';
import * as argon2 from 'argon2';

@Injectable()
export class PasswordService {
  /**
   * hash a password or a secret
   *
   * @param {string} plainTextPassword - actual password enterd by user
   * @returns {Promise<string>} hashed password
   */
  public hash(plainTextPassword: string): Promise<string> {
    return argon2.hash(plainTextPassword, {
      type: argon2.argon2id,
      memoryCost: 64 * 1024, // minimum memory size (64 MB)
      timeCost: 3, // iterations
      parallelism: 1,
    });
  }

  /**
   * verify that an enterd password/secret is the same as hashed/stored password
   *
   * @param {string} plainTextPassword - actual password enterd by user
   * @param {string} hashedPassword
   *
   * @returns {Promise<boolean>}
   */
  public isSame(
    plainTextPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return argon2.verify(hashedPassword, plainTextPassword);
  }
}
