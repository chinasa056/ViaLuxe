import { Module } from '@nestjs/common';
import { EmailNotificationService } from './email-notification.service';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import { pubSub, PUB_SUB } from 'src/common/pubsub';
// import { AuthModule } from 'src/auth/auth.module';


@Module({ 
  imports: [ConfigModule],
  providers: [
    EmailNotificationService,
    PrismaService,
    { provide: PUB_SUB, useValue: pubSub },
  ],
  exports: [EmailNotificationService, PUB_SUB],
})
export class EmailNotificationModule {}