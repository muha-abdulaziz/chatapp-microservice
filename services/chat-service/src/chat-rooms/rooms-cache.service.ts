import {Inject, Injectable} from '@nestjs/common';
import Redis from 'ioredis';
import {MessageModel} from './models/message.model';

@Injectable()
export class RoomsCacheService {
  constructor(@Inject('REDIS_CONNECTION') private readonly redis: Redis) {}

  getRoomKey(roomName: string): string {
    return `room:${roomName}`;
  }

  async addMessage(room: string, message: MessageModel): Promise<void> {
    // [TODO] get from config
    const maxCachedMsgs = 10;

    await this.redis
      .pipeline()
      // add a new message to the cache list
      .xadd(
        this.getRoomKey(room),
        '*',
        message._id.toString(), // key (message id)
        JSON.stringify(message), // value (message body)
      )
      // remove messages older that allowed cache items
      .xtrim(this.getRoomKey(room), 'MAXLEN', maxCachedMsgs)
      .exec();
  }

  async getMessages(room: string, count?: number) {
    count = count ?? 10;
    // async getMessages(room: string, count?: number): Promise<MessageModel[]> {
    return this.redis.xrange(this.getRoomKey(room), '-', '+', 'COUNT', count);
  }
}
