import {Module} from '@nestjs/common';
import {ConfigModule} from '@nestjs/config';
import {AuthModule} from './auth/auth.module';
import {MongodbModule} from './mongodb/mongodb.module';
import {MsgBusModule} from './msg-bus/msg-bus.module';

@Module({
  imports: [
    AuthModule,
    MongodbModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath:
        process.env.NODE_ENV === 'production' ? '.env' : '.env.development',
    }),
    MsgBusModule,
  ],
  providers: [],
})
export class AppModule {}
