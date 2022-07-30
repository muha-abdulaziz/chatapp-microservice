import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          brokers: [process.env['KAFKA_BROKER_URI']],
          clientId: process.env['KAFKA_CLIENT_ID'],
        },
        consumer: { groupId: process.env['KAFKA_GROUP_ID'] },
      },
    },
  );

  await app.listen();
}
bootstrap();
