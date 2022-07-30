import { Controller, Logger } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { MsgBusTopics } from 'src/msg-bus/enums/msg-bus-topics.enum';
import { IConfirmEmailEvent } from 'src/msg-bus/interfaces/confirm-email.interface';
import { EmailService } from './email.service';

@Controller('email')
export class EmailController {
  private readonly logger = new Logger(EmailController.name);

  constructor(private emailServie: EmailService) {}

  @EventPattern(MsgBusTopics.SEND_RESET_TOKEN)
  async sendResetToken(data: IConfirmEmailEvent) {
    this.logger.debug('');
    await this.emailServie.sendEmailConfirmation(data);
  }
}
