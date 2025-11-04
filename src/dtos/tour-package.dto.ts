import { Field, GraphQLISODateTime, ID, InputType, Int, ObjectType } from "@nestjs/graphql";
import { IsArray, IsDate, IsEnum, IsNumber, IsOptional, IsString } from "class-validator";
import { Status } from "./blog.dto";
import { TourType } from "./tour-type.dto";
import { ClientCategoryPriceOptionType, CreateClientCategoryPriceOptionInput, UpsertClientCategoryPriceOptionInput } from "./pricing-option.dto";

@ObjectType()
export class TourPackageType {
    @Field(() => ID, {nullable: true}) id?: string | null;

    @Field({ nullable: true }) tourTitle?: string; 

    @Field({ nullable: true }) location?: string; 

    @Field(() => Number, {nullable: true}) minimumPrice?: number | null;

    @Field(() => TourType, {nullable: true}) tourType?: TourType | null;

    @Field(() => Status, { nullable: true }) status?: Status; 

    @Field(() => [String], { nullable: true }) 
    coverMedia?: string[] | null;

    @Field(() => GraphQLISODateTime, { nullable: true }) departureDate?: Date; 

    @Field(() => GraphQLISODateTime, { nullable: true }) returnDate?: Date; 

    @Field(() => Int, { nullable: true }) duration?: number; 

    @Field(() => GraphQLISODateTime, { nullable: true }) datePublished?: Date | null;

    @Field({ nullable: true }) description?: string; 

    @Field({ nullable: true }) activities?: string; 

    @Field(() => [ClientCategoryPriceOptionType], { description: 'All associated client price categories for this tour.', nullable: true })
    clientPriceOptions?: ClientCategoryPriceOptionType[] | null;

    @Field(() => Boolean, { nullable: true }) highlighted?: boolean; 
    @Field(() => Boolean, { nullable: true }) archived?: boolean; 

    @Field(() => GraphQLISODateTime, { nullable: true }) createdAt?: Date; 

    @Field(() => GraphQLISODateTime, { nullable: true }) updatedAt?: Date; 
}

@InputType()
export class CreateTourPackageInput {
    @Field({ nullable: true }) @IsString() @IsOptional() tourTitle?: string; 

    @Field({ nullable: true }) @IsString() @IsOptional() location?: string; 

    @Field(() => Number, { nullable: true }) @IsNumber() @IsOptional() minimumPrice?: number | null;

    @Field(()=> String, {nullable: true}) @IsString() @IsOptional() tourTypeId?: string | null;

    @Field(() => Status, { nullable: true }) @IsOptional() @IsEnum(Status) status?: Status;

    @Field(() => [String], { nullable: true }) 
    @IsOptional() 
    @IsArray()
    coverMedia?: string[];

    @Field(() => GraphQLISODateTime, { nullable: true }) @IsOptional() @IsDate() departureDate?: Date; 

    @Field(() => GraphQLISODateTime, { nullable: true }) @IsOptional() @IsDate() returnDate?: Date; 
    
    @Field(() => Int, { nullable: true }) @IsOptional() @IsNumber() duration?: number;

    @Field({ nullable: true }) @IsString() @IsOptional() description?: string; 

    @Field({ nullable: true }) @IsString() @IsOptional() activities?: string; 


    @Field(() => [CreateClientCategoryPriceOptionInput], { nullable: true })
    @IsOptional() 
    @IsArray()
    priceOptions?: CreateClientCategoryPriceOptionInput[];
    
    @Field(() => Boolean, { nullable: true }) @IsOptional() highlighted?: boolean; 
    @Field(() => Boolean, { nullable: true }) @IsOptional() archived?: boolean;
}

@InputType()
export class EditTourPackageInput {
    @Field({ nullable: true }) @IsOptional() @IsString() tourTitle?: string;

    @Field({ nullable: true }) @IsOptional() @IsString() location?: string;

    @Field(() => Number, { nullable: true }) @IsOptional() @IsNumber() minimumPrice?: number;

    @Field(() => String, { nullable: true }) @IsOptional() @IsString() tourTypeId?: string; 

    @Field(() => Status, { nullable: true }) @IsOptional() @IsEnum(Status) status?: Status;

    @Field(() => [String], { nullable: true })
    @IsOptional()
    @IsArray()
    coverMedia?: string[]; 

    @Field(() => GraphQLISODateTime, { nullable: true }) @IsOptional() @IsDate() departureDate?: Date;

    @Field(() => GraphQLISODateTime, { nullable: true }) @IsOptional() @IsDate() returnDate?: Date;

    @Field(() => Int, { nullable: true }) @IsOptional() @IsNumber() duration?: number;

    @Field({ nullable: true }) @IsOptional() @IsString() description?: string;

    @Field({ nullable: true }) @IsOptional() @IsString() activities?: string;

    @Field(() => [UpsertClientCategoryPriceOptionInput], { nullable: true })
    @IsOptional()
    @IsArray()
    priceOptionsToUpsert?: UpsertClientCategoryPriceOptionInput[];

    @Field(() => [ID], { nullable: true, description: 'IDs of existing options to delete.' })
    @IsOptional()
    @IsArray()
    priceOptionIdsToDelete?: string[];

    @Field(() => Boolean, { nullable: true }) @IsOptional() highlighted?: boolean;
    @Field(() => Boolean, { nullable: true }) @IsOptional() archived?: boolean;
}


@InputType()
export class TourFilterInput {
    @Field({ nullable: true }) @IsOptional() @IsString() search?: string;

    @Field(() => Status, { nullable: true }) @IsOptional() @IsEnum(Status) status?: Status;

    @Field(() => String, { nullable: true }) @IsOptional() @IsString() tourTypeId?: string;

    @Field(() => String, { nullable: true }) @IsOptional() @IsString() location?: string;

    @Field(() => Date, { nullable: true }) @IsOptional() @IsDate() startDate?: Date;

    @Field(() => Date, { nullable: true }) @IsOptional() @IsDate() endDate?: Date;

    @Field(() => Int, { nullable: true, defaultValue: 1 }) @IsOptional() page?: number;

    @Field(() => Int, { nullable: true, defaultValue: 10 }) @IsOptional() pageSize?: number;
}

@ObjectType()
export class PaginatedTours {
    @Field(() => [TourPackageType]) data: TourPackageType[];

    @Field() total: number;

    @Field() page: number;

    @Field() pageSize: number;
}

@ObjectType()
export class CreateTourResponse {
    @Field(() => String) message!: string;

    @Field(() => TourPackageType) tour!: TourPackageType;
}