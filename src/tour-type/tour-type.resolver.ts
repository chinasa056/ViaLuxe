import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { TourTypeService } from 'src/tour-type/tour-type.service';
import { TourType, CreateTourTypeInput, EditTourTypeInput } from 'src/dtos/tour-type.dto';

@Resolver(() => TourType)
export class TourTypeResolver {
  constructor(private readonly tourTypeService: TourTypeService) {}

  @Mutation(() => TourType)
  async createTourType(@Args('data') data: CreateTourTypeInput): Promise<TourType> {
    return this.tourTypeService.createTourType(data);
  }

  @Query(() => [TourType], { name: 'getAllTourTypes' })
  async getAllTourTypes(): Promise<TourType[]> {
    return this.tourTypeService.getAllTourTypes();
  }

  @Mutation(() => TourType)
  async editTourType(@Args('id') id: string, @Args('data') data: EditTourTypeInput): Promise<TourType> {
    return this.tourTypeService.editTourType(id, data);
  }

  @Mutation(() => String)
  async deleteTourType(@Args('id') id: string): Promise<String> {
    return this.tourTypeService.deleteTourType(id);
  }
}
