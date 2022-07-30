import { Controller, Logger } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { MsgBusTopics } from 'src/msg-bus/enums/msg-bus-topics.enum';

@Controller('email')
export class EmailController {
  private readonly logger = new Logger(EmailController.name);

  @EventPattern(MsgBusTopics.SEND_RESET_TOKEN)
  async sendResetToken(data: Record<string, unknown>) {
    this.logger.log(JSON.stringify(data, null, 2));
  }
}
