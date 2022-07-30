import {Module} from '@nestjs/common';
import {MongodbModule} from 'src/mongodb/mongodb.module';
import {AuthController} from './auth.controller';
import {AuthService} from './auth.service';

@Module({
  imports: [MongodbModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
