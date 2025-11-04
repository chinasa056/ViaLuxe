import { Module } from '@nestjs/common';
import { EmailSubscriberService } from './email-subscriber.service';
import { EmailSubscriberResolver } from './email-subscriber.resolver';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [EmailSubscriberResolver, EmailSubscriberService, PrismaService],
})
export class EmailSubscriberModule {}
