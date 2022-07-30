import {Module} from '@nestjs/common';
import {AppService} from './app.service';
import {AuthModule} from './auth/auth.module';
import {MongodbModule} from './mongodb/mongodb.module';

@Module({
  imports: [AuthModule, MongodbModule],
  providers: [AppService],
})
export class AppModule {}
