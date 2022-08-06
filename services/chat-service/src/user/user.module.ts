import {Module} from '@nestjs/common';
import {DbConnectionsModule} from 'src/dbs/db-conections.module';
import {UserController} from './user.controller';
import {UserService} from './user.service';

@Module({
  imports: [DbConnectionsModule],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
