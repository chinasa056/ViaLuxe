import { Field, GraphQLISODateTime, ID, InputType, Int, ObjectType } from "@nestjs/graphql";
import { IsDate, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, IsArray, Min, MaxLength, MinLength } from "class-validator";
import { Status } from "./blog.dto"; 
import { CreateVisaPriceOptionInput, UpsertVisaPriceOptionInput, VisaPriceOptionType } from "./pricing-option.dto";

@ObjectType()
export class VisaChecklistType {
    @Field(() => ID) id: string;
    
    @Field(()=> String, { nullable: true }) country?: string; 
    
    @Field({ nullable: true }) location?: string; 
    
    @Field(() => [VisaPriceOptionType], { description: 'All associated duration and price options for this visa.' })
    visaPriceOptions: VisaPriceOptionType[];

    @Field(()=> String,{ nullable: true }) description?: string; 

    @Field(() => Status, { nullable: true }) status?: Status;

    @Field(() => [String], { nullable: true }) 
    images?: string[] | null; 

    @Field(() => GraphQLISODateTime, { nullable: true }) datePublished?: Date | null;
    
    @Field(() => Boolean, { nullable: true }) highlighted?: boolean; 
    
    @Field(() => Boolean, { nullable: true }) archived?: boolean;
    
    @Field(() => GraphQLISODateTime, { nullable: true }) createdAt?: Date;
    
    @Field(() => GraphQLISODateTime, { nullable: true }) updatedAt?: Date;
}

@InputType()
export class CreateVisaChecklistInput {
    @Field({ nullable: true }) @IsString() @IsOptional() country?: string; 
    
    @Field({ nullable: true }) @IsString() @IsOptional() location?: string; 
    
    @Field(() => [CreateVisaPriceOptionInput], { nullable: true, description: 'Initial duration and price options to create for this visa.' })
    @IsArray()
    @IsOptional()
    visaPriceOptions?: CreateVisaPriceOptionInput[];

    @Field({ nullable: true }) @IsString() @IsOptional() description?: string;

    @Field(() => Status, { nullable: true }) @IsOptional() @IsEnum(Status) status?: Status;

    @Field(() => [String], { nullable: true }) 
    @IsArray() 
    @IsOptional()
    images?: string[];
    

    @Field(() => Boolean, { nullable: true }) @IsOptional() highlighted?: boolean;

    @Field(() => Boolean, { nullable: true }) @IsOptional() archived?: boolean;
}

@InputType()
export class EditVisaChecklistInput {
    @Field({ nullable: true }) @IsOptional() @IsString() country?: string;
    @Field({ nullable: true }) @IsOptional() @IsString() location?: string;
    
    @Field(() => [UpsertVisaPriceOptionInput], { nullable: true, description: 'Options to create (no ID) or update (with ID).' })
    @IsArray()

    @IsOptional()
    visaPriceOptionsToUpsert?: UpsertVisaPriceOptionInput[];
    
    @Field(() => [ID], { nullable: true, description: 'IDs of existing options to delete.' })

    @IsOptional()
    durationOptionIdsToDelete?: string[];
    
    @Field({ nullable: true }) @IsOptional() @IsString() description?: string;
    
    @Field(() => [String], { nullable: true }) @IsOptional() @IsArray() images?: string[];

    @Field(() => Status, { nullable: true }) @IsOptional() @IsEnum(Status) status?: Status;
  
    @Field(() => Boolean, { nullable: true }) @IsOptional() highlighted?: boolean;
    @Field(() => Boolean, { nullable: true }) @IsOptional() archived?: boolean;
}

@InputType()
export class VisaChecklistFilterInput {
    @Field(() => Status, { nullable: true }) @IsOptional() @IsEnum(Status) status?: Status;
    @Field({ nullable: true }) @IsOptional() @IsString() country?: string;
    @Field({ nullable: true }) @IsOptional() @IsString() location?: string;
    
    @Field(() => GraphQLISODateTime, { nullable: true }) @IsOptional() @IsDate() startDate?: Date;
    @Field(() => String, { nullable: true }) @IsOptional() dateRangePreset?: string;
    @Field(() => GraphQLISODateTime, { nullable: true }) @IsOptional() @IsDate() endDate?: Date;

    @Field(() => Int, { nullable: true, defaultValue: 1 }) @IsOptional() page?: number;
    @Field(() => Int, { nullable: true, defaultValue: 10 }) @IsOptional() pageSize?: number;
}

@ObjectType()
export class PaginatedVisaChecklists {
    @Field(() => [VisaChecklistType]) data: VisaChecklistType[];
    @Field() total: number;
    @Field() page: number;
    @Field() pageSize: number;
}

@ObjectType()
export class VisaChecklistResponse {
    @Field(() => String) message!: string;
    @Field(() => VisaChecklistType, { nullable: true })
    checklist?: VisaChecklistType;
}

@ObjectType()
export class DeleteVisaChecklistResponse {
    @Field(() => String) message: string;
}