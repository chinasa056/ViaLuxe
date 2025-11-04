import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { BlogService } from './blog.service';
import { BlogFilterInput, BlogType, CreateBlogInput, CreateBlogResponse, EditBlogInput, PaginatedBlogs, Status } from 'src/dtos/blog.dto';
import { Public } from "src/jwt/public.decorator";

@Resolver(() => BlogType)
export class BlogResolver {
  constructor(private readonly blogService: BlogService) { }

  @Mutation(() => CreateBlogResponse)
  async createBlog(@Args('data', { type: () => CreateBlogInput }) data: CreateBlogInput): Promise<CreateBlogResponse> {
    return this.blogService.createBlog(data);
  };

  @Mutation(() => CreateBlogResponse)
  async editBlog(
    @Args('id', { type: () => String }) id: string,
    @Args('data', { type: () => EditBlogInput }) data: EditBlogInput
  ): Promise<CreateBlogResponse> {
    return this.blogService.editBlog(id, data);
  };


  @Mutation(() => CreateBlogResponse)
async updateBlogStatus(
  @Args('id') id: string,
  @Args('status', { type: () => Status }) status: Status,
) {
  return this.blogService.updateBlogStatus(id, status);
}

  @Mutation(() => String)
  async deleteBlog(@Args('id', { type: () => String }) id: string): Promise<String> {
    return this.blogService.deleteBlog(id);
  };

  @Public()
  @Query(() => BlogType, { name: 'getHighlightedBlog', nullable: true })
  async getHighlightedBlog(): Promise<BlogType | null> {
    return this.blogService.getHighlightedBlog();
  };

  @Public()
  @Query(() => [BlogType], { name: 'getAllPublishedBlogs' })
  async getAllPublishedBlogs(): Promise<BlogType[]> {
    return this.blogService.getAllPublishedBlogs();
  };

  @Query(() => [BlogType], { name: 'getAllDraftBlogs' })
  async getAllDraftBlogs(): Promise<BlogType[]> {
    return this.blogService.getAllDraftBlogs();
  };

  @Query(() => [BlogType], { name: 'getAllArchivedBlogs' })
  async getAllArchivedBlogs(): Promise<BlogType[]> {
    return this.blogService.getAllArchivedBlogs();
  };

  @Public()
  @Query(() => BlogType, { name: 'getOneBlog', nullable: true })
  async getOneBlog(@Args('id', { type: () => String }) id: string): Promise<BlogType | null> {
    return this.blogService.getOneBlog(id);
  };

  @Query(() => PaginatedBlogs, { name: 'getAllBlogs' })
  async getBlogs(
    @Args('filter', { nullable: true }) filter?: BlogFilterInput,
  ): Promise<PaginatedBlogs> {
    console.log('--- Resolver Received Filter ---', filter);
    return this.blogService.getAllBlogs(filter ?? {});
  }

  @Query(() => [BlogType], { name: 'searchBlogs' })
  async searchBlogs(@Args('title', { type: () => String }) title: string): Promise<BlogType[]> {
    return this.blogService.searchBlogTitle(title);
  };





  // @Query(() => [Blog], { name: 'blog' })
  // findAll() {
  //   return this.blogService.findAll();
  // }

  // @Query(() => Blog, { name: 'blog' })
  // findOne(@Args('id', { type: () => Int }) id: number) {
  //   return this.blogService.findOne(id);
  // }

  // @Mutation(() => Blog)
  // updateBlog(@Args('updateBlogInput') updateBlogInput: UpdateBlogInput) {
  //   return this.blogService.update(updateBlogInput.id, updateBlogInput);
  // }

  // @Mutation(() => Blog)
  // removeBlog(@Args('id', { type: () => Int }) id: number) {
  //   return this.blogService.remove(id);
  // }
}
