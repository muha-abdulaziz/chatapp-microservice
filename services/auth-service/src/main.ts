import {ConfigService} from '@nestjs/config';
import {NestFactory} from '@nestjs/core';
import {Transport} from '@nestjs/microservices';
import {NestExpressApplication} from '@nestjs/platform-express';
import {join} from 'path';
import {AppModule} from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);

  app.setGlobalPrefix('auth');
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('ejs');

  app.connectMicroservice(
    {
      transport: Transport.KAFKA,
      options: {
        brokers: [
          configService.get('AUTH_KAFKA_BROKER_URI') ?? 'localhost:9092',
        ],
      },
    },
    {inheritAppConfig: true},
  );

  await app.startAllMicroservices();
  await app.listen(configService.get('AUTH_PORT') ?? 3000);
}
bootstrap();
