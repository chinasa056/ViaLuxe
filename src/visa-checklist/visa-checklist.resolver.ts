import { Resolver, Query, Mutation, Args, ID } from "@nestjs/graphql";
import { VisaChecklistService } from "./visa-checklist.service";
import {
    CreateVisaChecklistInput,
    EditVisaChecklistInput,
    VisaChecklistFilterInput,
    VisaChecklistType,
    PaginatedVisaChecklists,
    VisaChecklistResponse,
    DeleteVisaChecklistResponse
} from "../dtos/visa-checklist.dto";
import { Status } from "src/dtos/blog.dto";

@Resolver(() => VisaChecklistType)
export class VisaChecklistResolver {
    constructor(private readonly checklistService: VisaChecklistService) { }

    @Mutation(() => VisaChecklistResponse)
    async createVisaChecklist(
        @Args("data") data: CreateVisaChecklistInput,
    ): Promise<VisaChecklistResponse> {
        return this.checklistService.create(data);
    }

    @Mutation(() => VisaChecklistResponse)
    async editVisaChecklist(
        @Args("id", { type: () => ID }) id: string,
        @Args("data") data: EditVisaChecklistInput,
    ): Promise<VisaChecklistResponse> {
        return this.checklistService.edit(id, data);
    }
    
    @Mutation(() => VisaChecklistResponse)
    async changeVisaChecklistStatus(
        @Args('id') id: string,
        @Args('status', { type: () => Status }) status: Status,
    ) {
        return this.checklistService.changeStatus(id, status);
    }

    @Query(() => [VisaChecklistType], { name: 'searchVisaChecklist' })
    async searchVisaChecklist(
        @Args("term") term: string,
    ): Promise<VisaChecklistType[]> {
        return this.checklistService.searchVisaCountry(term);
    }

    @Mutation(() => DeleteVisaChecklistResponse)
    async deleteVisaChecklist(
        @Args("id", { type: () => ID }) id: string,
    ): Promise<DeleteVisaChecklistResponse> {
        return this.checklistService.delete(id);
    }

    @Query(() => [VisaChecklistType])
    async getAllPublishedVisaChecklists(): Promise<VisaChecklistType[]> {
        return this.checklistService.getAllPublishedChecklists()
    }

    @Query(() => VisaChecklistType, { nullable: true })
    async getHighlightedVisaChecklist(): Promise<VisaChecklistType | null> {
        return this.checklistService.getHighlightedChecklist()
    }

    @Query(() => VisaChecklistType, { name: 'getVisaChecklist', nullable: true })
    async getVisaChecklist(
        @Args("id", { type: () => ID }) id: string,
    ): Promise<VisaChecklistType | null> {
        return this.checklistService.findOne(id);
    }

    @Query(() => PaginatedVisaChecklists, { name: 'getAllVisaChecklists' })
    async getAllVisaChecklists(
        @Args("filter", { nullable: true }) filter: VisaChecklistFilterInput,
    ): Promise<PaginatedVisaChecklists> {
        return this.checklistService.findAll(filter || {});
    }
}