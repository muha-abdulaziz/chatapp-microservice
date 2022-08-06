import {ConfigService} from '@nestjs/config';
import {NestFactory} from '@nestjs/core';
import {Transport} from '@nestjs/microservices';
import {NestExpressApplication} from '@nestjs/platform-express';
import {join} from 'path';
import {RedisIoAdapter} from './adapters/redis-io.adapter';
import {AppModule} from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);

  // config the template engine
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('hbs');

  // config kafka
  app.connectMicroservice(
    {
      transport: Transport.KAFKA,
      options: {
        brokers: [
          configService.get('CHAT_KAFKA_BROKER_URI') ?? 'localhost:9092',
        ],
        consumer: {groupId: configService.get('CHAT_KAFKA_GROUP_ID')},
      },
    },
    {inheritAppConfig: true},
  );

  // config redis adapter for socket.io
  const redisIoAdapter = new RedisIoAdapter(app);
  await redisIoAdapter.connectToRedis(configService);
  app.useWebSocketAdapter(redisIoAdapter);

  await app.startAllMicroservices();
  await app.listen(configService.get('CHAT_PORT') || 3001);
}
bootstrap();
