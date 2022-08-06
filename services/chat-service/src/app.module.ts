import {Module} from '@nestjs/common';
import {ConfigModule} from '@nestjs/config';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {ChatRoomsModule} from './chat-rooms/chat-rooms.module';
import {DbConnectionsModule} from './dbs/db-conections.module';
import {MsgBusModule} from './msg-bus/msg-bus.module';
import {UserModule} from './user/user.module';

@Module({
  imports: [
    DbConnectionsModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath:
        process.env.NODE_ENV === 'production'
          ? '.env'
          : ['.env.development', '.env'],
    }),
    UserModule,
    MsgBusModule,
    ChatRoomsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
