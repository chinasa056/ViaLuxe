import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { BlogTagResolver } from './blog-tag.resolver';
import { BlogTagService } from './blog-tag.service';

@Module({
  providers: [BlogTagResolver, BlogTagService,PrismaService],
})
export class BlogTagModule {}
