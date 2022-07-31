import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
import {ClientProxy} from '@nestjs/microservices';
import {Collection, Db} from 'mongodb';
import {MsgBusTopics} from 'src/msg-bus/enums/msg-bus-topics.enum';
import {IConfirmEmailEvent} from 'src/msg-bus/interfaces/confirm-email.interface';
import {User} from 'src/user/models/user.model';
import {UserService} from 'src/user/user.service';
import {URL} from 'url';
import * as uuid from 'uuid';
import {ResetPasswordDto} from './dto/reset-password.dto';
import {ISetToken} from './interfaces/set-token.interface';
import {ResetTokenModel} from './models/reset-token.model';
import {PasswordService} from './password.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  resetCollection: Collection;
  constructor(
    @Inject('MONGODB_CONNECTION')
    private db: Db,
    @Inject('MSG_BUS')
    private msgBus: ClientProxy,
    private configService: ConfigService,
    private passwordService: PasswordService,
    private userService: UserService,
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

  /**
   * Add a reset token in the database, and send it to a user throw email
   * [TODO] handle duplicate tokens
   * [TODO] may add a schedule or cron job to remove old tokens
   */
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

    // [TODO] add method to generate emit payload
    const url = new URL(
      `/auth/reset-password?token=${token}`,
      this.configService.get('APP_URI'),
    );

    this.msgBus
      .emit(MsgBusTopics.SEND_RESET_TOKEN, {
        urlRedirect: url.toString(),
        email: data.email,
      } as IConfirmEmailEvent)
      .subscribe(e => console.log(e));
  }

  isResetTokenValid(sentToken: string, actualToken: ResetTokenModel | null) {
    if (!actualToken) return false;

    const expired = actualToken.expiry >= new Date().toISOString();

    if (expired) return false;

    return actualToken.token === sentToken;
  }

  async resetPassword(data: ResetPasswordDto) {
    const existingToken = await this.resetCollection.findOne<ResetTokenModel>({
      token: data.token,
    });

    if (!this.isResetTokenValid(data.token, existingToken))
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);

    const hashedPassword = await this.passwordService.hash(data.password);

    // create new user or change password
    const existingUser = await this.userService.getUserByEmail(
      existingToken.email,
    );

    if (existingToken) {
      await this.userService.updateUser(existingUser._id, {
        password: hashedPassword,
      });
    } else {
      const date = new Date().toISOString();

      const createdUser = new User({
        _id: uuid,
        email: existingToken.email,
        password: hashedPassword,
        createdAt: date,
        updatedAt: date,
      });
      await this.userService.addNewUser(createdUser);

      this.msgBus.emit(MsgBusTopics.USER_CREATED, createdUser);
    }
    return;
  }
}
