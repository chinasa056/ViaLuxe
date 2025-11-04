import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { BlogTagService } from './blog-tag.service';
import { BlogTagType, CreateBlogTagInput, EditBlogTagInput } from 'src/dtos/blog-tags.dto';

@Resolver(() => BlogTagType)
export class BlogTagResolver {
  constructor(private readonly blogTag: BlogTagService) {}

  @Mutation(() => BlogTagType)
  async createBlogTag(@Args('data') data: CreateBlogTagInput): Promise<BlogTagType> {
    return this.blogTag.createBlogTag(data);
  }

  @Query(() => [BlogTagType], { name: 'getAllBlogTags' })
  async getAllBlogTags(): Promise<BlogTagType[]> {
    return this.blogTag.getAllBlogTags();
  }

  @Mutation(() => BlogTagType)
  async editBlogTag(@Args('id') id: string, @Args('data') data: EditBlogTagInput): Promise<BlogTagType> {
    return this.blogTag.editBlogTag(id, data);
  }

  @Mutation(() => String)
  async deleteBlogTag(@Args('id') id: string): Promise<String> {
    return this.blogTag.deleteBlogTag(id);
  }
}
