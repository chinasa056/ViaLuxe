import { Module } from '@nestjs/common';
import { VisaChecklistService } from './visa-checklist.service';
import { VisaChecklistResolver } from './visa-checklist.resolver';
import { PrismaService } from 'src/prisma/prisma.service';
import { CompressionService } from 'src/common/utils/compression.service';

@Module({
  providers: [VisaChecklistResolver, VisaChecklistService, PrismaService, CompressionService],
})
export class VisaChecklistModule {}
