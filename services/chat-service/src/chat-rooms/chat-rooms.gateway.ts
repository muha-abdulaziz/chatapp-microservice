import {UseGuards} from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import {Logger} from 'mongodb';
import {Socket} from 'socket.io';
import {AuthGuard} from 'src/auth.guard';
import * as uuid from 'uuid';
import {ChatRoomsService} from './chat-rooms.service';
import {MessageModel} from './models/message.model';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  // transports: ['websocket'],
})
@UseGuards(AuthGuard)
export class ChatRoomsGateway {
  private readonly logger = new Logger(ChatRoomsGateway.name);
  constructor(private readonly chatRoomsService: ChatRoomsService) {}

  @SubscribeMessage('message')
  async handleMessage(
    @MessageBody() data: string,
    @ConnectedSocket() client: Socket,
  ): Promise<MessageModel> {
    this.logger.debug('Getting a message.');

    const msg = new MessageModel({
      _id: uuid.v4(),
      // get user id from auth guard
      sender: {id: '', email: ''},
      sentAt: new Date().toISOString(),
      msgBody: data,
    });

    client.broadcast.emit('message', msg);
    await this.chatRoomsService.saveMessage('general', msg);
    return msg;
  }
}
