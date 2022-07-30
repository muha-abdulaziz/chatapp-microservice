import {Module} from '@nestjs/common';
import {MongodbModule} from 'src/mongodb/mongodb.module';
import {MsgBusModule} from 'src/msg-bus/msg-bus.module';
import {AuthController} from './auth.controller';
import {AuthService} from './auth.service';

@Module({
  imports: [MongodbModule, MsgBusModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
