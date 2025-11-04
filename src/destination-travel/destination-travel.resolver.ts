import { Resolver, Query, Mutation, Args, ID } from "@nestjs/graphql";
import { DestinationTravelService } from "./destination-travel.service";
import {
  CreateDestinationTravelInput,
  EditDestinationTravelInput,
  DestinationFilterInput,
  DestinationTravelType,
  PaginatedDestinations,
  DestinationTravelResponse,
  DeleteDestinationResponse
} from "../dtos/destination-travel.dto";
import { Status } from "src/dtos/blog.dto";
import { Public } from "src/jwt/public.decorator";

@Resolver(() => DestinationTravelType)
export class DestinationTravelResolver {
  constructor(private readonly destinationService: DestinationTravelService) { }

  @Mutation(() => DestinationTravelResponse)
  async createDestinationTravel(
    @Args("data") data: CreateDestinationTravelInput,
  ): Promise<DestinationTravelResponse> {
    return this.destinationService.create(data);
  }

  @Mutation(() => DestinationTravelResponse)
  async editDestinationTravel(
    @Args("id", { type: () => ID }) id: string,
    @Args("data") data: EditDestinationTravelInput,
  ): Promise<DestinationTravelResponse> {
    return this.destinationService.edit(id, data);
  }

  @Public()
  @Mutation(() => DestinationTravelResponse)
async updateDestinationTravelStatus(
  @Args('id') id: string,
  @Args('status', { type: () => Status }) status: Status,
): Promise<DestinationTravelResponse> {
  return this.destinationService.updateDestinationTravelStatus(id, status);
}

  @Query(() => [DestinationTravelType], { name: 'searchTourTitles' })
  async searchDestinationTitles(
    @Args("title") title: string,
  ): Promise<DestinationTravelType[]> {
    return this.destinationService.searchDestinationTitle(title);
  }

  @Mutation(() => DeleteDestinationResponse)
  async deleteDestinationTravel(
    @Args("id", { type: () => ID }) id: string,
  ): Promise<DeleteDestinationResponse> {
    return this.destinationService.delete(id);
  }

  @Public()
  @Query(() => [DestinationTravelType])
  async getAllPublishedDestinations(): Promise<DestinationTravelType[]> {
    return this.destinationService.getAllPublishedDestinations()
  }

  @Public()
  @Query(() => [DestinationTravelType], {nullable:true})
  async getHighlightedDestination(): Promise<DestinationTravelType[] | null> {
    return this.destinationService.getHighlightedDestination()
  }

  @Public()
  @Query(() => DestinationTravelType, { name: 'getDestinationTravel', nullable: true })
  async getDestinationTravel(
    @Args("id", { type: () => ID }) id: string,
  ): Promise<DestinationTravelType | null> {
    return this.destinationService.findOne(id);
  }

  @Query(() => PaginatedDestinations, { name: 'getAllDestinationTravels' })
  async getAllDestinationTravels(
    @Args("filter", { nullable: true }) filter: DestinationFilterInput,
  ): Promise<PaginatedDestinations> {
    return this.destinationService.findAll(filter || {});
  }
}
