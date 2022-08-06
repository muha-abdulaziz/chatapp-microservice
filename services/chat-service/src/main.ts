import {ConfigService} from '@nestjs/config';
import {NestFactory} from '@nestjs/core';
import {Transport} from '@nestjs/microservices';
import {NestExpressApplication} from '@nestjs/platform-express';
import {join} from 'path';
import {AppModule} from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);

  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('hbs');

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

  await app.startAllMicroservices();
  await app.listen(configService.get('CHAT_PORT') ?? 3001);
}
bootstrap();
