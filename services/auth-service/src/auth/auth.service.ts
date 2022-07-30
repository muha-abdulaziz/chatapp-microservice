import {Inject, Injectable, Logger} from '@nestjs/common';
import {Collection, Db} from 'mongodb';
import {ISetToken} from './interfaces/set-token.interface';
import {ResetTokenModel} from './models/reset-token.model';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  resetCollection: Collection;
  constructor(
    @Inject('MONGODB_CONNECTION')
    private db: Db,
  ) {
    this.resetCollection = this.db.collection('resetTokens');
  }

  /**
   *  It generate a unique and secure string
   * @returns {string}
   */
  genToken(): string {
    // [TODO] generate token properly
    return 'asklfmds';
  }

  genExpiryDate(minutes = 60): string {
    const now = new Date();
    const later = new Date().setMinutes(now.getMinutes() + minutes);

    return new Date(later).toISOString();
  }

  async setToken(data: ISetToken) {
    const date = new Date().toISOString();

    const resetToken = new ResetTokenModel({
      email: data.email,
      token: this.genToken(),
      expiry: this.genExpiryDate(),
      createdAt: date,
      updatedAt: date,
    });

    try {
      await this.resetCollection.insertOne(resetToken);
    } catch (e) {
      this.logger.log(e);

      throw new Error();
    }
  }
}
