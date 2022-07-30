import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, Logger } from '@nestjs/common';
import { IConfirmEmailEvent } from 'src/msg-bus/interfaces/confirm-email.interface';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  constructor(private mailerService: MailerService) {}

  async sendEmailConfirmation(data: IConfirmEmailEvent) {
    this.logger.debug('Sending an email');

    await this.mailerService.sendMail({
      to: data.email,
      // from: '"Support Team" <support@example.com>', // override default from
      subject: 'Chatapp - Confirm your Email',
      template: './confirmation',
      context: {
        url: data.urlRedirect,
        urlRedirect: data.urlRedirect,
      },
    });
  }
}
