import {Inject, Injectable} from '@nestjs/common';
import {Collection, Db} from 'mongodb';
import {ResetTokenModel} from './models/reset-token.model';

@Injectable()
export class ResetPasswordService {
  resetCollection: Collection;
  constructor(
    @Inject('MONGODB_CONNECTION')
    private db: Db,
  ) {
    this.resetCollection = this.db.collection('resetTokens');
  }

  // async addResetToken(resetToken: ResetTokenModel) {}

  getResetTokenBytoken(token: string) {
    return this.resetCollection.findOne<ResetTokenModel>({token});
  }
}
