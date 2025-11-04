import { Field, GraphQLISODateTime, ID, InputType, Int, ObjectType } from "@nestjs/graphql";
import { IsDate, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, IsArray, Min, MaxLength, MinLength, IsBoolean } from "class-validator";
import { Status } from "./blog.dto";
import { ClientCategoryPriceOptionType, CreateClientCategoryPriceOptionInput, UpsertClientCategoryPriceOptionInput } from "./pricing-option.dto";

@ObjectType()
export class DestinationTravelType {
    @Field(() => ID, {nullable: true}) id?: string | null;

    @Field({ nullable: true }) tourTitle?: string;
    @Field({ nullable: true }) location?: string;
    @Field(() => Number, { nullable: true }) minimumPrice?: number | null;

    @Field(() => Status, { nullable: true }) status?: Status; 

    @Field(() => [String], { nullable: true })
    coverMedia?: string[] | null;

    @Field(() => GraphQLISODateTime, { nullable: true }) departureDate?: Date; 

    @Field(() => GraphQLISODateTime, { nullable: true }) returnDate?: Date; 

    @Field(() => Int, { nullable: true }) duration?: number; 
    
    @Field(() => GraphQLISODateTime, { nullable: true }) datePublished?: Date | null;
    @Field({ nullable: true }) description?: string; 
    
    @Field(() => String, { nullable: true }) activities?: string | null;

    @Field(() => [ClientCategoryPriceOptionType], { description: 'All associated client price categories for this destination.', nullable: true })
    clientPriceOptions?: ClientCategoryPriceOptionType[];

    @Field(() => Boolean, { nullable: true }) highlighted?: boolean; 
    
    @Field(() => Boolean, { nullable: true }) archived?: boolean; 

    @Field(() => GraphQLISODateTime, { nullable: true }) createdAt?: Date; 

    @Field(() => GraphQLISODateTime, { nullable: true }) updatedAt?: Date; 

}

@InputType()
export class CreateDestinationTravelInput {
    @Field({ nullable: true }) @IsString() @IsOptional() tourTitle?: string;

    @Field({ nullable: true }) @IsString() @IsOptional() location?: string;

    @Field(() => Number, { nullable: true }) @IsNumber() @IsOptional() @Min(0) minimumPrice?: number | null; 

    @Field(() => GraphQLISODateTime, { nullable: true }) @IsOptional() @IsDate() departureDate?: Date;

    @Field(() => GraphQLISODateTime, { nullable: true }) @IsOptional() @IsDate() returnDate?: Date; 

    @Field({ nullable: true }) @IsOptional() @IsString() description?: string; 

    @Field(() => Status, { nullable: true }) @IsOptional() @IsEnum(Status) status?: Status;

    @Field(() => [String], { nullable: true })
    @IsArray()
    @IsOptional() 
    coverMedia?: string[];

    @Field({ nullable: true }) @IsOptional() @IsString() activities?: string; 
    
    @Field(() => [CreateClientCategoryPriceOptionInput], { nullable: true, description: 'Initial client price categories to create for this destination.' })
    @IsArray()
    @IsOptional() 
    priceOptions?: CreateClientCategoryPriceOptionInput[];
    
    @Field(() => Boolean, { nullable: true }) @IsOptional() @IsBoolean() highlighted?: boolean;
    @Field(() => Boolean, { nullable: true }) @IsOptional() @IsBoolean() archived?: boolean;
}

@InputType()
export class EditDestinationTravelInput {
    @Field({ nullable: true }) @IsOptional() @IsString() tourTitle?: string;

    @Field({ nullable: true }) @IsOptional() @IsString() location?: string;

    @Field(() => Number, { nullable: true }) @IsOptional() @IsNumber() minimumPrice?: number;

    @Field(() => [String], { nullable: true }) @IsOptional() @IsArray() coverMedia?: string[];

    @Field(() => GraphQLISODateTime, { nullable: true }) @IsOptional() @IsDate() departureDate?: Date;

    @Field(() => GraphQLISODateTime, { nullable: true }) @IsOptional() @IsDate() returnDate?: Date;

    @Field({ nullable: true }) @IsOptional() @IsString() description?: string;

    @Field({ nullable: true }) @IsOptional() @IsString() activities?: string;

    @Field(() => [UpsertClientCategoryPriceOptionInput], { nullable: true, description: 'Options to create (no ID) or update (with ID).' })
    @IsArray()
    @IsOptional()
    priceOptionsToUpsert?: UpsertClientCategoryPriceOptionInput[];

    @Field(() => [ID], { nullable: true, description: 'IDs of existing options to delete.' })
    @IsOptional()
    priceOptionIdsToDelete?: string[];

    @Field(() => Status, { nullable: true }) @IsOptional() @IsEnum(Status) status?: Status;

    @Field(() => Boolean, { nullable: true }) @IsOptional() @IsBoolean() highlighted?: boolean;
    @Field(() => Boolean, { nullable: true }) @IsOptional() @IsBoolean() archived?: boolean;
}

@InputType()
export class DestinationFilterInput {

    @Field({ nullable: true }) @IsOptional() @IsString() search?: string;

    @Field(() => Status, { nullable: true }) @IsOptional() @IsEnum(Status) status?: Status;

    @Field({ nullable: true }) @IsOptional() @IsString() location?: string;

    @Field(() => GraphQLISODateTime, { nullable: true }) @IsOptional() @IsDate() startDate?: Date;

    @Field(() => String, { nullable: true }) @IsOptional() dateRangePreset?: string;

    @Field(() => GraphQLISODateTime, { nullable: true }) @IsOptional() @IsDate() endDate?: Date;

    @Field(() => Int, { nullable: true, defaultValue: 1 }) @IsOptional() page?: number;

    @Field(() => Int, { nullable: true, defaultValue: 10 }) @IsOptional() pageSize?: number;
}

@ObjectType()
export class PaginatedDestinations {
    @Field(() => [DestinationTravelType]) data: DestinationTravelType[];

    @Field() total: number;

    @Field() page: number;

    @Field() pageSize: number;
}

@ObjectType()
export class DestinationTravelResponse {
    @Field(() => String) message!: string;

    @Field(() => DestinationTravelType, { nullable: true })

    destination?: DestinationTravelType;
}

@ObjectType()
export class DeleteDestinationResponse {
    @Field(() => String) message: string;
}