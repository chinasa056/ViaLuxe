import { Resolver, Query, Mutation, Args, Int } from "@nestjs/graphql";
import { EmailSubscriberService } from "./email-subscriber.service";
import {
    CreateEmailSubscriberInput,
    EmailSubscriberType,
    EmailSubscriberResponse,
    PaginatedEmailSubscribers,
} from "../dtos/email-subscriber.dto";
import { Public } from "src/jwt/public.decorator";

@Resolver(() => EmailSubscriberType)
export class EmailSubscriberResolver {
    constructor(private readonly subscriberService: EmailSubscriberService) {}

      @Public()
    @Mutation(() => EmailSubscriberResponse, { name: 'subscribeToUpdates' })
    async subscribeToUpdates(
        @Args("data") data: CreateEmailSubscriberInput,
    ): Promise<EmailSubscriberResponse> {
        return this.subscriberService.collect(data);
    }

    @Query(() => PaginatedEmailSubscribers, { name: 'getAllSubscribers' })
    async getAllSubscribers(
        @Args("page", { type: () => Int, nullable: true, defaultValue: 1 }) page: number,
        @Args("pageSize", { type: () => Int, nullable: true, defaultValue: 10 }) pageSize: number,
    ): Promise<PaginatedEmailSubscribers> {
        return this.subscriberService.getAllSubscribers(page, pageSize);
    }

    @Query(() => [EmailSubscriberType], { name: 'searchSubscribers' })
    async searchSubscribers(
        @Args("term") term: string,
    ): Promise<EmailSubscriberType[]> {
        return this.subscriberService.searchSubscribers(term);
    }
}