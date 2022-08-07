import {Controller, Get, Render} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
import {ChatRoomsService} from './chat-rooms.service';

@Controller()
export class ChatRoomsController {
  constructor(
    private readonly chatRoomsService: ChatRoomsService,
    private readonly configService: ConfigService,
  ) {}

  @Get()
  @Render('chat-room')
  async chatRoomPage() {
    const messages = await this.chatRoomsService.getLatestMessages('general');

    return {messages, loginPage: this.configService.get('AUTH_URI')};
  }
}
