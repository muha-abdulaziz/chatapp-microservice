import {Module} from '@nestjs/common';
import {MongodbModule} from 'src/mongodb/mongodb.module';
import {MsgBusModule} from 'src/msg-bus/msg-bus.module';
import {UserModule} from 'src/user/user.module';
import {AuthController} from './auth.controller';
import {AuthService} from './auth.service';
import {PasswordService} from './password.service';
import {ResetPasswordService} from './reset-password.service';

@Module({
  imports: [MongodbModule, MsgBusModule, UserModule],
  controllers: [AuthController],
  providers: [AuthService, PasswordService, ResetPasswordService],
})
export class AuthModule {}
