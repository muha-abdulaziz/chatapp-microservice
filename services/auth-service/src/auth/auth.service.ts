import {Inject, Injectable, Logger} from '@nestjs/common';
import {ClientProxy} from '@nestjs/microservices';
import {Collection, Db} from 'mongodb';
import {MsgBusTopics} from 'src/msg-bus/enums/msg-bus-topics.enum';
import {ISetToken} from './interfaces/set-token.interface';
import {ResetTokenModel} from './models/reset-token.model';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  resetCollection: Collection;
  constructor(
    @Inject('MONGODB_CONNECTION')
    private db: Db,
    @Inject('MSG_BUS')
    private msgBus: ClientProxy,
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
    const token = this.genToken();

    const resetToken = new ResetTokenModel({
      email: data.email,
      token,
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

    this.msgBus.emit(MsgBusTopics.SEND_RESET_TOKEN, {
      resetToken: token,
      email: data.email,
    });
  }
}
