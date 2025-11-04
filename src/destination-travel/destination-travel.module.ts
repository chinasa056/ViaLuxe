import { Module } from '@nestjs/common';
import { DestinationTravelService } from './destination-travel.service';
import { DestinationTravelResolver } from './destination-travel.resolver';
import { PrismaService } from 'src/prisma/prisma.service';
import { CompressionService } from 'src/common/utils/compression.service';

@Module({
  providers: [DestinationTravelResolver, DestinationTravelService, PrismaService,CompressionService],
})
export class DestinationTravelModule {}
