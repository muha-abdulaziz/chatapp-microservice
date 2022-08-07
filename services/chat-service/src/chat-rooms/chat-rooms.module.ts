import {Module} from '@nestjs/common';
import {APP_GUARD} from '@nestjs/core';
import {AuthGuard} from 'src/auth.guard';
import {DbConnectionsModule} from 'src/dbs/db-conections.module';
import {ChatRoomsController} from './chat-rooms.controller';
import {ChatRoomsGateway} from './chat-rooms.gateway';
import {ChatRoomsService} from './chat-rooms.service';
import {RoomsCacheService} from './rooms-cache.service';

@Module({
  imports: [DbConnectionsModule],
  providers: [
    ChatRoomsGateway,
    ChatRoomsService,
    RoomsCacheService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
  controllers: [ChatRoomsController],
})
export class ChatRoomsModule {}
