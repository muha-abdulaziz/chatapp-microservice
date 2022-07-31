import {Module} from '@nestjs/common';
import {ConfigModule, ConfigService} from '@nestjs/config';
import {ClientProxyFactory, Transport} from '@nestjs/microservices';

@Module({
  imports: [ConfigModule],
  exports: ['MSG_BUS'],
  providers: [
    {
      provide: 'MSG_BUS',
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return ClientProxyFactory.create({
          transport: Transport.KAFKA,
          options: {
            client: {
              clientId: configService.get('AUTH_KAFKA_CLIENT_ID'),
              brokers: [configService.get('AUTH_KAFKA_BROKER_URI')],
            },
          },
        });
      },
    },
  ],
})
export class MsgBusModule {}
