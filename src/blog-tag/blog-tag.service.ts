import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { BlogTagType, CreateBlogTagInput, EditBlogTagInput } from 'src/dtos/blog-tags.dto';

@Injectable()
export class BlogTagService {
  constructor(private readonly prisma: PrismaService) { }

  async createBlogTag(data: CreateBlogTagInput): Promise<BlogTagType> {
    const created = await this.prisma.blogTag.create({ data });
    return created;
  }

  async getAllBlogTags(): Promise<BlogTagType[]> {
    return this.prisma.blogTag.findMany({ orderBy: { name: 'asc' } });
  }

  async editBlogTag(id: string, data: EditBlogTagInput): Promise<BlogTagType> {
    const existing = await this.prisma.blogTag.findUnique({ where: { id } });
    if (!existing) throw new HttpException('Blog Tag not found', 404);
    const updated = await this.prisma.blogTag.update({ where: { id }, data });
    return updated;
  }

  async deleteBlogTag(id: string): Promise<string> {
    const existing = await this.prisma.blogTag.findUnique({ where: { id } });
    if (!existing) throw new HttpException('Blog Tag not found', 404);
    
   const assignedBlogCount = await this.prisma.blog.count({ 
        where: { tagId: id } 
    })

    if (assignedBlogCount > 0) {
      throw new BadRequestException('Cannot delete tag with blogs assighned to it')
    };

    await this.prisma.blogTag.delete({ where: { id } });
    return 'Blog tag deleted successfully';
  }
}
