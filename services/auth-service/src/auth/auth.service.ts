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
import {nanoid} from 'nanoid/async';
import {MsgBusTopics} from 'src/msg-bus/enums/msg-bus-topics.enum';
import {IConfirmEmailEvent} from 'src/msg-bus/interfaces/confirm-email.interface';
import {User} from 'src/user/models/user.model';
import {UserService} from 'src/user/user.service';
import {URL} from 'url';
import * as uuid from 'uuid';
import {ResetPasswordDto} from './dto/reset-password.dto';
import {SigninDto} from './dto/signin.dto';
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

  async checkCredentials(credentials: SigninDto): Promise<User | null> {
    const user = await this.userService.getUserByEmail(credentials.email);
    if (!user) return null;

    const isValidPass = await this.passwordService.isSame(
      credentials.password,
      user.password,
    );
    if (isValidPass) return user;

    return null;
  }

  /**
   *  It generate a unique and secure string
   * @returns {string}
   */
  async genResetToken(): Promise<string> {
    return nanoid();
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
    const token = await this.genResetToken();

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
      .subscribe({error: e => this.logger.error(e)});
  }

  isResetTokenValid(sentToken: string, actualToken: ResetTokenModel | null) {
    if (!actualToken) return false;

    const expired = actualToken.expiry <= new Date().toISOString();

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

    if (existingUser) {
      await this.userService.updateUser(existingUser._id, {
        password: hashedPassword,
      });
    } else {
      const date = new Date().toISOString();

      const createdUser = new User({
        _id: uuid.v4(),
        email: existingToken.email,
        password: hashedPassword,
        createdAt: date,
        updatedAt: date,
      });
      await this.userService.addNewUser(createdUser);
      delete createdUser.password;

      this.msgBus
        .emit(MsgBusTopics.USER_CREATED, JSON.stringify(createdUser))
        .subscribe({
          next: v => {
            this.logger.log('Sent a user created event');
            this.logger.debug(JSON.stringify(v));
          },
          error: e => {
            this.logger.error('create user event not has an error', e);
          },
        });
    }
    return;
  }
}
