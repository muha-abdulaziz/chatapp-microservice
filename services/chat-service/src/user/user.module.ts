import {Module} from '@nestjs/common';
import {MongodbModule} from 'src/mongodb/mongodb.module';
import {UserController} from './user.controller';
import {UserService} from './user.service';

@Module({
  imports: [MongodbModule],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
