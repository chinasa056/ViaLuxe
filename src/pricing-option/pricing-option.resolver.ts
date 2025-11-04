import { Resolver, Query, Mutation, Args, ID, Int } from "@nestjs/graphql";
import { PricingOptionService } from "./pricing-option.service";
import {
    CreateClientCategoryPriceOptionInput,
    EditClientCategoryPriceOptionInput,
    ClientCategoryPriceOptionResponse,
    PaginatedClientCategoryPriceOptions,
    CreateVisaPriceOptionInput,
    EditVisaPriceOptionInput,
    VisaPriceOptionResponse,
    PaginatedVisaPriceOptions,
    DeletePriceOptionResponse
} from "../dtos/pricing-option.dto";

@Resolver()
export class PricingOptionResolver {
    constructor(private readonly priceOptionService: PricingOptionService) {}

// tour packages and destination travel
    @Mutation(() => ClientCategoryPriceOptionResponse)
    async createClientPriceOption(
        @Args("data") data: CreateClientCategoryPriceOptionInput,
    ): Promise<ClientCategoryPriceOptionResponse> {
        return this.priceOptionService.createClientOption(data);
    }

    @Mutation(() => ClientCategoryPriceOptionResponse)
    async editClientPriceOption(
        @Args("id", { type: () => ID }) id: string,
        @Args("data") data: EditClientCategoryPriceOptionInput,
    ): Promise<ClientCategoryPriceOptionResponse> {
        return this.priceOptionService.editClientOption(id, data);
    }

    @Query(() => PaginatedClientCategoryPriceOptions, { name: 'getAllClientPriceOptions' })
    async getAllClientPriceOptions(
        @Args("page", { type: () => Int, nullable: true, defaultValue: 1 }) page: number,
        @Args("pageSize", { type: () => Int, nullable: true, defaultValue: 10 }) pageSize: number,
    ): Promise<PaginatedClientCategoryPriceOptions> {
        return this.priceOptionService.getAllClientOptions(page, pageSize);
    }
    
    @Mutation(() => DeletePriceOptionResponse)
    async deleteClientPriceOption(
        @Args("id", { type: () => ID }) id: string,
    ): Promise<DeletePriceOptionResponse> {
        return this.priceOptionService.deleteClientOption(id);
    }

//  Visa duration and pricing options 
    @Mutation(() => VisaPriceOptionResponse)
    async createVisaPriceOption(
        @Args("data") data: CreateVisaPriceOptionInput,
    ): Promise<VisaPriceOptionResponse> {
        return this.priceOptionService.createVisaOption(data);
    }

    @Mutation(() => VisaPriceOptionResponse)
    async editVisaPriceOption(
        @Args("id", { type: () => ID }) id: string,
        @Args("data") data: EditVisaPriceOptionInput,
    ): Promise<VisaPriceOptionResponse> {
        return this.priceOptionService.editVisaOption(id, data);
    }

    @Query(() => PaginatedVisaPriceOptions, { name: 'getAllVisaPriceOptions' })
    async getAllVisaPriceOptions(
        @Args("page", { type: () => Int, nullable: true, defaultValue: 1 }) page: number,
        @Args("pageSize", { type: () => Int, nullable: true, defaultValue: 10 }) pageSize: number,
    ): Promise<PaginatedVisaPriceOptions> {
        return this.priceOptionService.getAllVisaOptions(page, pageSize);
    }
    
    @Mutation(() => DeletePriceOptionResponse)
    async deleteVisaPriceOption(
        @Args("id", { type: () => ID }) id: string,
    ): Promise<DeletePriceOptionResponse> {
        return this.priceOptionService.deleteVisaOption(id);
    }
}