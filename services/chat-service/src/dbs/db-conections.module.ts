import {Module} from '@nestjs/common';
import {ConfigModule, ConfigService} from '@nestjs/config';
import Redis from 'ioredis';
import {Db, MongoClient} from 'mongodb';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: 'MONGODB_CONNECTION',
      inject: [ConfigService],
      useFactory: async (configService: ConfigService): Promise<Db> => {
        try {
          // [TODO] get connection string from env
          // const client = await MongoClient.connect('mongodb://127.0.0.1');
          const client = await MongoClient.connect(
            configService.get('CHAT_MONGODB_URI'),
          );

          return client.db(configService.get('CHAT_MONGODB_DB_NAME'));
        } catch (e) {
          throw e;
        }
      },
    },
    {
      provide: 'REDIS_CONNECTION',
      inject: [ConfigService],
      useFactory: async (configService: ConfigService): Promise<Redis> => {
        try {
          // [TODO] get connection string from env
          // const client = await MongoClient.connect('mongodb://127.0.0.1');
          const client = new Redis(
            (configService?.get('CHAT_REDIS_URI') ||
              'redis://localhost:6379') as string,
          );

          return client;
        } catch (e) {
          throw e;
        }
      },
    },
  ],
  exports: ['MONGODB_CONNECTION', 'REDIS_CONNECTION'],
})
export class DbConnectionsModule {}
