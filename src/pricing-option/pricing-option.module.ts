import { Module } from '@nestjs/common';
import { PricingOptionService } from './pricing-option.service';
import { PricingOptionResolver } from './pricing-option.resolver';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [PricingOptionResolver, PricingOptionService, PrismaService],
})
export class PricingOptionModule {}
