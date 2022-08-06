import {ConfigService} from '@nestjs/config';
import {IoAdapter} from '@nestjs/platform-socket.io';
import {createAdapter} from '@socket.io/redis-adapter';
import Redis from 'ioredis';
import {ServerOptions} from 'socket.io';

export class RedisIoAdapter extends IoAdapter {
  private adapterConstructor: ReturnType<typeof createAdapter>;

  async connectToRedis(configService?: ConfigService): Promise<void> {
    const pubClient = new Redis(
      (configService?.get('CHAT_REDIS_URI') ||
        'redis://localhost:6379') as string,
    );
    const subClient = pubClient.duplicate();

    this.adapterConstructor = createAdapter(pubClient, subClient);
  }

  createIOServer(port: number, options?: ServerOptions): any {
    const server = super.createIOServer(port, options);
    server.adapter(this.adapterConstructor);
    return server;
  }
}
