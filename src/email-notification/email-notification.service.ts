import { Inject, Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import {
  SendWelcomeEmailDto,
} from '../dtos/notifications.dto';
import { EVENTS, PUB_SUB } from '../common/pubsub';
import { PubSub } from 'graphql-subscriptions';
import { ISendMailOptions } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

interface EmailDetails {
  type: string;
  mailOptions: ISendMailOptions;
  metadata?: Record<string, any>;
}

@Injectable()
export class EmailNotificationService {
  private readonly logger = new Logger(EmailNotificationService.name);

  constructor(
    private readonly mailerService: MailerService,
    @Inject(PUB_SUB) private readonly pubSub: PubSub,
    private readonly configService: ConfigService
  ) { }

  private async sendEmail(details: EmailDetails): Promise<void> {
    const { type, mailOptions, metadata } = details;
    try {
      await this.mailerService.sendMail(mailOptions);
      this.logger.log(`${type} email sent to ${mailOptions.to as string}`);
      this.pubSub.publish(EVENTS.NOTIFICATION_EVENT, {
        notification: {
          type: 'EMAIL_SENT',
          payload: {
            type,
            recipient: mailOptions.to,
            subject: mailOptions.subject,
            status: 'success',
            timestamp: new Date(),
            metadata,
          },
        },
      });
    } catch (error) {
      this.logger.error(
        `Failed to send ${type} email to ${mailOptions.to as string}`,
        error.stack,
      );
      this.pubSub.publish(EVENTS.NOTIFICATION_EVENT, {
        notification: {
          type: 'EMAIL_SENT',
          payload: {
            type,
            recipient: mailOptions.to,
            subject: mailOptions.subject,
            status: 'failure',
            error: error.message,
            timestamp: new Date(),
            metadata,
          },
        },
      });
      throw error;
    }
  }

  async sendWelcomeEmail(dto: SendWelcomeEmailDto) {
    const baseUrl = this.configService.get('BASE_URL');
    const logoUrl = `${baseUrl}/img/welcome.png`;

    await this.sendEmail({
      type: 'welcome',
      mailOptions: {
        to: dto.email,
        subject: 'Welcome to Aedion!',
        template: 'welcome',
        context: {
          name: dto.name,
          logoUrl: logoUrl,
        },
      },
    });
  }
}