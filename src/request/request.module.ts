import { Module } from '@nestjs/common';
import { RequestService } from './request.service';
import { RequestResolver } from './request.resolver';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [RequestResolver, RequestService, PrismaService],
})
export class RequestModule {}
