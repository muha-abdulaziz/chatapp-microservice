import {Injectable} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
import * as jwt from 'jsonwebtoken';
import {Logger} from 'mongodb';
import {User} from 'src/user/models/user.model';
import {AccessTokenPayLoad} from './models/access-token-payload.model';

@Injectable()
export class AccessTokenService {
  private readonly logger = new Logger(AccessTokenService.name);

  constructor(private readonly configService: ConfigService) {}

  async generate(user: User): Promise<string> {
    return new Promise((res, rej) => {
      jwt.sign(
        // [TODO] add helper to generate the payload
        {_id: user._id.toString()},
        this.configService.get('ACCESS_TOKEN_SECRET'),
        // [todo] move to config module
        {expiresIn: this.configService.get('ACCESS_TOKEN_EXPIRY') || '1h'},
        (err, token) => {
          if (err) {
            this.logger.error(err?.toString());
            return rej(err);
          }

          return res(token);
        },
      );
    });
  }

  async verify(token: string): Promise<AccessTokenPayLoad> {
    return new Promise((res, rej) => {
      jwt.verify(
        token,
        this.configService.get('ACCESS_TOKEN_SECRET'),
        (err, payload) => {
          if (err) {
            this.logger.error(err?.toString());
            return rej(err);
          }

          return res(payload as AccessTokenPayLoad);
        },
      );
    });
  }
}
