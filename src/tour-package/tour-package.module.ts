import { Module } from '@nestjs/common';
import { TourPackageService } from './tour-package.service';
import { TourPackageResolver } from './tour-package.resolver';
import { PrismaService } from 'src/prisma/prisma.service';
import { CompressionService } from 'src/common/utils/compression.service';

@Module({
  providers: [TourPackageResolver, TourPackageService, PrismaService,CompressionService],
})
export class TourPackageModule {}
