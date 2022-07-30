import {Module} from '@nestjs/common';
import {ConfigModule, ConfigService} from '@nestjs/config';
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
            configService.get('MONGODB_URI'),
          );

          return client.db(configService.get('MONGODB_DB_NAME'));
        } catch (e) {
          throw e;
        }
      },
    },
  ],
  exports: ['MONGODB_CONNECTION'],
})
export class MongodbModule {}
