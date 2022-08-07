import {Inject, Injectable} from '@nestjs/common';
import {Db, Logger} from 'mongodb';
import {MessageModel} from './models/message.model';
import {RoomsCacheService} from './rooms-cache.service';

@Injectable()
export class ChatRoomsService {
  private readonly logger = new Logger(ChatRoomsService.name);

  constructor(
    @Inject('MONGODB_CONNECTION') private readonly mongo: Db,
    private readonly roomsCacheService: RoomsCacheService,
  ) {}

  getRoomCollectionName(roomName: string): string {
    return `room#${roomName}`;
  }

  async saveMessage(room: string, message: MessageModel): Promise<void> {
    await this.mongo
      .collection(this.getRoomCollectionName(room))
      .insertOne(message);

    await this.roomsCacheService.addMessage(room, message);
  }

  async getLatestMessages(room: string) {
    // get from config
    const messagesCount = 10;
    let messages;

    try {
      messages = await this.roomsCacheService.getMessages(room, messagesCount);

      messages = [];

      if (!messages.length) {
        const result = await this.mongo
          .collection(this.getRoomCollectionName(room))
          .find<MessageModel>({})
          .sort({sentAt: -1})
          .limit(messagesCount);

        messages = (await result.toArray()).reverse();
      }
    } catch (e) {
      this.logger.error(e);
    }

    return messages ?? [];
  }
}
