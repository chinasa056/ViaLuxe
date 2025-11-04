import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { Status, Prisma } from '@prisma/client';
import { BlogFilterInput, BlogType, CreateBlogInput, CreateBlogResponse, EditBlogInput, PaginatedBlogs } from 'src/dtos/blog.dto';
import { PrismaService } from 'src/prisma/prisma.service';
// 🌟 REFACTOR: Remove date-fns imports, as they are now in the utility layer
// import { addDays, addMonths, addYears, startOfDay, startOfMonth, startOfYear } from 'date-fns';
import { CompressionService } from 'src/common/utils/compression.service';

// 🌟 REFACTOR: Import utility functions
import { BaseContentService } from '../common/utils/base-content.service';
import { dateRangePresetToDates } from '../common/utils/dateRange';
import { buildDateWhere } from '../common/utils/dateWhereBuilder';
import { buildPagination } from '../common/utils/pagination';


@Injectable()
export class BlogService extends BaseContentService {
 constructor(
  // prisma must be protected for BaseContentService
  protected readonly prisma: PrismaService, 
  private readonly compressionService: CompressionService,
 ) {
  super(prisma);
 }

 protected get model(): any {
  return this.prisma.blog;
 }

 protected get defaultInclude() {
  return this.getBaseInclude();
 }

 protected async mapToDto(blog: any): Promise<BlogType> {
  const decompressedContent = await this.compressionService.decompress(blog.content);
  return {
  ...blog,
  content: decompressedContent || ''
  } as BlogType;
 }

 private getBaseInclude() {
  return {
   tag: true,
  };
 }

 async createBlog(data: CreateBlogInput): Promise<CreateBlogResponse> {
  const finalStatus = data.status || Status.DRAFT;
  let datePublished: Date | null = null;

  if (finalStatus === Status.PUBLISHED) {
   datePublished = new Date();
  }

  if(data.tagId){
    const exstingTag = await this.prisma.blogTag.findUnique({ where: { id: data.tagId } });
    if (!exstingTag) throw new HttpException('Blog Tag not found', 404);
  }

  const compressedContent = await this.compressionService.compress(data.content);

  const newBlog = await this.prisma.blog.create({
   data: {
    title: data.title ? data.title : '',
    content: compressedContent || '',
    coverMedia: data.coverMedia || null,
    tagId: data.tagId ? data.tagId : undefined,
    status: finalStatus,
    datePublished: datePublished,
    highlighted: false,
    archived: false,
   },
   include: this.getBaseInclude(),
  });

  const message = finalStatus === Status.PUBLISHED
   ? 'Blog published successfully'
   : 'Blog saved as draft successfully';

  return {
   message: message,
   blog: await this.mapToDto(newBlog)
  }
 }

async editBlog(id: string, data: EditBlogInput): Promise<CreateBlogResponse> {
  const blog = await this.prisma.blog.findUnique({
   where: { id },
   include: this.getBaseInclude(),
  });

  if (!blog) {
   throw new NotFoundException('Blog not found');
  }

  if (blog.status === Status.ARCHIVED || blog.archived) {
   throw new HttpException('Cannot edit an archived blog', 400);
  };

  // Determine new status and datePublished
  const newStatus = data.status ?? blog.status;
  let datePublished = blog.datePublished;

  if (newStatus === Status.PUBLISHED && !blog.datePublished) {
   datePublished = new Date();
  } else if (newStatus !== Status.PUBLISHED && newStatus !== Status.HIGHLIGHTED) {
   datePublished = null;
  }

  let compressedContent: string | null = null;
  if (data.content !== undefined) {
    compressedContent = await this.compressionService.compress(data.content);
  }

  const updateData: Prisma.BlogUpdateInput = {
   title: data.title,
   content: compressedContent !== null ? compressedContent : undefined, 
   coverMedia: data.coverMedia,
   status: newStatus,
   datePublished: datePublished,
   
   // Use nested connect for 'tag' instead of direct 'tagId' assignment
   ...(data.tagId && {
    tag: {
     connect: { id: data.tagId }
    }
   })
  };

  const updatedBlog = await this.prisma.blog.update({
   where: { id },
   data: updateData, 
   include: this.getBaseInclude(),
  });

  return {
   message: 'Blog updated successfully',
   blog: await this.mapToDto(updatedBlog)
  }
 }

 async updateBlogStatus(id: string, newStatus: Status): Promise<CreateBlogResponse> {
  const blog = await this.prisma.blog.findUnique({ where: { id } });

  if (!blog) throw new NotFoundException('Blog not found');

  // Disallow certain invalid transitions
  if (blog.archived && newStatus === Status.HIGHLIGHTED) {
   throw new HttpException('Cannot highlight an archived blog', 400);
  }

  if (newStatus === Status.PUBLISHED && !blog.tagId) {
   throw new HttpException('Please assign a tag before publishing', 400);
  }

  let updateData: Prisma.BlogUpdateInput = {};
  let message: string;

  switch (newStatus) {
   case Status.PUBLISHED:
    updateData = {
     status: Status.PUBLISHED,
     archived: false,
     highlighted: false,
     datePublished: new Date(),
    };
    message = 'Blog published successfully.';
    break;

   case Status.ARCHIVED:
    if (blog.status === Status.DRAFT) {
     throw new HttpException('Cannot archive a draft blog', 400);
    }
    updateData = {
     status: Status.ARCHIVED,
     archived: true,
     highlighted: false,
    };
    message = 'Blog archived successfully.';
    break;

   case Status.HIGHLIGHTED:
    if (blog.status === Status.DRAFT || blog.archived) {
     throw new HttpException('Only published blogs can be highlighted', 400);
    }

  //  Use the BaseContentService method
    await this.unhighlightAllForModel();

    updateData = {
     status: Status.HIGHLIGHTED,
     highlighted: true,
     archived: false,
    };
    message = 'Blog highlighted successfully.';
    break;

   case Status.DRAFT:
    updateData = {
     status: Status.DRAFT,
     archived: false,
     highlighted: false,
    };
    message = 'Blog saved to draft successfully.';
    break;

   default:
    throw new HttpException('Invalid status provided', 400);
  }

  const updated = await this.prisma.blog.update({
   where: { id },
   data: updateData,
   include: this.getBaseInclude(),
  });

  return {
   message,
   blog: await this.mapToDto(updated),
  };
 }

 async deleteBlog(id: string): Promise<string> {
  const blog = await this.prisma.blog.findUnique({ where: { id } });
  if (!blog) throw new NotFoundException('Blog not found');

  await this.prisma.blog.delete({ where: { id } });
  return 'Blog deleted successfully';
 }

 async getOneBlog(id: string): Promise<BlogType | null> {
  const item = await super.findOne(id);
  return item as BlogType;
 };


 // --- QUERIES ---

 async getHighlightedBlog(): Promise<BlogType | null> {
  const blog = await this.prisma.blog.findFirst({
   where: { highlighted: true },
   include: this.getBaseInclude(),
  });
  return blog ? await this.mapToDto(blog) : null;
 }

 async getAllPublishedBlogs(): Promise<BlogType[]> {
  const blogs = await this.prisma.blog.findMany({
   where: { status: Status.PUBLISHED, archived: false },
   orderBy: { createdAt: 'desc' },
   include: this.getBaseInclude(),
  });

  return Promise.all(blogs.map((b) => this.mapToDto(b)));
 };

 async getAllDraftBlogs(): Promise<BlogType[]> {
  const blogs = await this.prisma.blog.findMany({
   where: { status: Status.DRAFT, archived: false },
   orderBy: { createdAt: 'desc' },
   include: this.getBaseInclude(),
  });
  return Promise.all(blogs.map((b) => this.mapToDto(b)));
 };

 async getAllArchivedBlogs(): Promise<BlogType[]> {
  const blogs = await this.prisma.blog.findMany({
   where: { archived: true, status: Status.ARCHIVED },
   orderBy: { createdAt: 'desc' },
   include: this.getBaseInclude(),
  });
 return Promise.all(blogs.map((b) => this.mapToDto(b)));
 };


 async getAllBlogs(filter: BlogFilterInput): Promise<PaginatedBlogs> {
  const { status, tagId, page = 1, pageSize = 10 } = filter;
  const { dateRangePreset, startDate: filterStartDate, endDate: filterEndDate } = filter;
  
  const { startDate, endDate } = dateRangePresetToDates(
   dateRangePreset,
   filterStartDate,
   filterEndDate
  );

  // Build the `where` condition
  const where: Prisma.BlogWhereInput = {};

  // Apply Status and Tag filters
  if (status) {
   where.status = status;
  }

  if (tagId) {
   where.tagId = tagId;
  }

  // Apply Search filter
  if (filter.search) {
   where.title = {
    contains: filter.search.trim(),
    // Added for robust searching
   };
  }

  if (startDate && endDate) {
   Object.assign(where, buildDateWhere(status, startDate, endDate));
  }

  // Apply Pagination
  const total = await this.prisma.blog.count({ where });

  //  Use utility for pagination calculation
  const { skip, take } = buildPagination(page, pageSize);

  const data = await this.prisma.blog.findMany({
   where,
   orderBy: {
    createdAt: 'desc',
   },
   skip,
   take,
   include: this.getBaseInclude(),
  });

  const decompressedData = await Promise.all(data.map((b) => this.mapToDto(b)));

  return { data: decompressedData, total, page, pageSize };

 }

 async searchBlogTitle(title: string): Promise<BlogType[]> {
  if (!title || title.trim() === '') {
   return [];
  }

  const blogs = await this.prisma.blog.findMany({
   where: {
    title: {
     contains: title.trim() 
       },
   },
   orderBy: { datePublished: 'desc' },
   take: 10,
   include: this.getBaseInclude(),
  });

  return Promise.all(blogs.map((b) => this.mapToDto(b)));
 }
}