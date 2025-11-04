import { Module } from '@nestjs/common';
import { BlogService } from './blog.service';
import { BlogResolver } from './blog.resolver';
import { PrismaService } from 'src/prisma/prisma.service';
import { CompressionService } from 'src/common/utils/compression.service';

@Module({
  providers: [BlogResolver, BlogService, PrismaService, CompressionService],
})
export class BlogModule {}
