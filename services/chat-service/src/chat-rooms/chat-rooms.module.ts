import {Module} from '@nestjs/common';
import {DbConnectionsModule} from 'src/dbs/db-conections.module';
import {ChatRoomsGateway} from './chat-rooms.gateway';
import {ChatRoomsService} from './chat-rooms.service';
import {RoomsCacheService} from './rooms-cache.service';

@Module({
  imports: [DbConnectionsModule],
  providers: [ChatRoomsGateway, ChatRoomsService, RoomsCacheService],
})
export class ChatRoomsModule {}
