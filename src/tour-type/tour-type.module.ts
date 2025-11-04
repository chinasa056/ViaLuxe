import { Module } from '@nestjs/common';
import { TourTypeService } from './tour-type.service';
import { TourTypeResolver } from './tour-type.resolver';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [TourTypeResolver, TourTypeService,PrismaService],
})
export class TourTypeModule {}
