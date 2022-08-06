import {Module} from '@nestjs/common';
import {MongodbModule} from 'src/mongodb/mongodb.module';
import {UserService} from './user.service';

@Module({
  imports: [MongodbModule],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
