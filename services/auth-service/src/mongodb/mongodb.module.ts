import {Module} from '@nestjs/common';
import {Db, MongoClient} from 'mongodb';

@Module({
  providers: [
    {
      provide: 'MONGODB_CONNECTION',
      useFactory: async (): Promise<Db> => {
        try {
          // [TODO] get connection string from env
          const client = await MongoClient.connect('mongodb://127.0.0.1');

          return client.db('chatApp');
        } catch (e) {
          throw e;
        }
      },
    },
  ],
  exports: ['MONGODB_CONNECTION'],
})
export class MongodbModule {}
