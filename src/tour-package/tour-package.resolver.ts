import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { TourPackageService } from 'src/tour-package/tour-package.service';
import { CreateTourPackageInput, EditTourPackageInput, PaginatedTours, TourFilterInput, CreateTourResponse, TourPackageType } from 'src/dtos/tour-package.dto';
import { Status } from 'src/dtos/blog.dto';
import { Public } from 'src/jwt/public.decorator';

@Resolver(() => TourPackageType)
export class TourPackageResolver {
  constructor(private readonly tourService: TourPackageService) {}

  @Mutation(() => CreateTourResponse)
  async createTourPackage(@Args('data') data: CreateTourPackageInput): Promise<CreateTourResponse> {
    return this.tourService.createTourPackage(data);
  }

  @Mutation(() => CreateTourResponse)
  async editTourPackage(@Args('id') id: string, @Args('data') data: EditTourPackageInput): Promise<CreateTourResponse> {
    return this.tourService.editTourPackage(id, data);
  }

  @Public()
  @Mutation(() => CreateTourResponse)
 async updateTourPackageStatus(
   @Args('id') id: string,
   @Args('status', { type: () => Status }) status: Status,
 ) {
   return this.tourService.updateTourPackageStatus(id, status);
 }

  @Mutation(() => String)
  async deleteTourPackage(@Args('id') id: string): Promise<String> {
    return this.tourService.deleteTourPackage(id);
  }

  @Public()
  @Query(() => [TourPackageType], { name: 'getHighlightedTourPackage', nullable: true })
  async getHighlightedTourPackage(): Promise<TourPackageType[] | null> {
    return this.tourService.getHighlightedTourPackage();
  }

  @Public()
  @Query(() => [TourPackageType], { name: 'getAllPublishedTours' })
  async getAllPublishedTours(): Promise<TourPackageType[]> {
    return this.tourService.getAllPublishedTours();
  }

  @Public()
  @Query(() => TourPackageType, { name: 'getOneTourPackage', nullable: true })
  async getOneTourPackage(@Args('id') id: string): Promise<TourPackageType | null> {
    return this.tourService.getOneTourPackage(id);
  }

  @Query(() => PaginatedTours, { name: 'getAllTours' })
  async getTours(@Args('filter', { nullable: true }) filter?: TourFilterInput): Promise<PaginatedTours> {
    return this.tourService.getAllTours(filter ?? {});
  }

  @Query(() => [TourPackageType], { name: 'searchTours' })
  async searchTours(@Args('title') title: string): Promise<TourPackageType[]> {
    return this.tourService.searchTourTitle(title);
  }
}
