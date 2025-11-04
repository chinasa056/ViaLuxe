import { Field, GraphQLISODateTime, ID, InputType, Int, ObjectType } from "@nestjs/graphql";
import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from "class-validator";


// CLIENT PRICE OPTION (For Tour Package / Destination) 

@ObjectType()
export class ClientCategoryPriceOptionType {
    @Field(() => ID) id: string;
    @Field() categoryName: string;
    @Field(() => Number) price: number;
    @Field(() => GraphQLISODateTime) createdAt: Date;
    @Field(() => GraphQLISODateTime) updatedAt: Date;
}

@InputType()
export class CreateClientCategoryPriceOptionInput {
    @Field() @IsString() @IsNotEmpty() categoryName: string;
    @Field(() => Number) @IsNumber() @Min(0) price: number;
}

@InputType()
export class EditClientCategoryPriceOptionInput {
    @Field({ nullable: true }) @IsOptional() @IsString() categoryName?: string;
    @Field(() => Number, { nullable: true }) @IsOptional() @IsNumber() @Min(0) price?: number;
}

@ObjectType()
export class ClientCategoryPriceOptionResponse {
    @Field(() => String) message!: string;
    @Field(() => ClientCategoryPriceOptionType, { nullable: true })
    option?: ClientCategoryPriceOptionType;
}

@ObjectType()
export class PaginatedClientCategoryPriceOptions {
    @Field(() => [ClientCategoryPriceOptionType]) data: ClientCategoryPriceOptionType[];
    @Field() total: number;
    @Field() page: number;
    @Field() pageSize: number;
}

// File: price-option.dto.ts (Add these helpers)

@InputType()
export class UpsertClientCategoryPriceOptionInput extends CreateClientCategoryPriceOptionInput {
    @Field(() => ID, { nullable: true }) @IsOptional() id?: string;
}

// VISA PRICE OPTION (For Visa Checklist)

@ObjectType()
export class VisaPriceOptionType {
    @Field(() => ID) id: string;
    @Field(() => Int) durationInDays: number;
    @Field(() => Number) price: number;
    @Field(() => GraphQLISODateTime) createdAt: Date;
    @Field(() => GraphQLISODateTime) updatedAt: Date;
}

@InputType()
export class CreateVisaPriceOptionInput {
    @Field(() => Int) @IsNumber() @Min(1) durationInDays: number;
    @Field(() => Number) @IsNumber() @Min(0) price: number;
}

@InputType()
export class EditVisaPriceOptionInput {
    @Field(() => Int, { nullable: true }) @IsOptional() @IsNumber() @Min(1) durationInDays?: number;
    @Field(() => Number, { nullable: true }) @IsOptional() @IsNumber() @Min(0) price?: number;
}

@ObjectType()
export class VisaPriceOptionResponse {
    @Field(() => String) message!: string;
    @Field(() => VisaPriceOptionType, { nullable: true })
    option?: VisaPriceOptionType;
}

@ObjectType()
export class PaginatedVisaPriceOptions {
    @Field(() => [VisaPriceOptionType]) data: VisaPriceOptionType[];
    @Field() total: number;
    @Field() page: number;
    @Field() pageSize: number;
}

@ObjectType()
export class DeletePriceOptionResponse {
    @Field(() => String) message: string;
}


@InputType()
export class UpsertVisaPriceOptionInput extends CreateVisaPriceOptionInput {
    @Field(() => ID, { nullable: true }) @IsOptional() id?: string;
}