
import { Field, GraphQLISODateTime, ID, InputType, Int, ObjectType, registerEnumType } from "@nestjs/graphql";
import { IsDate, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { BlogTagType } from "./blog-tags.dto";

export enum Status {
    DRAFT = 'DRAFT',
    PUBLISHED = 'PUBLISHED',
    ARCHIVED = 'ARCHIVED',
    HIGHLIGHTED = 'HIGHLIGHTED'
}
registerEnumType(Status, { name: "Status" });

@ObjectType()
export class BlogType {
    @Field(() => ID, { nullable: true })
    id: string;

    @Field(() => String, { nullable: true })
    title: string;

    @Field(() => String, { nullable: true })
    content: string;

    @Field(() => String, { nullable: true })
    coverMedia?: string | null;

    @Field(() => GraphQLISODateTime, { nullable: true })
    datePublished?: Date;

    @Field(() => Status, { nullable: true })
    status: Status;

    @Field(() => Boolean, { nullable: true })
    highlighted: boolean;

    @Field(() => Boolean, {nullable: true})
    archived: boolean

    @Field(() => BlogTagType, { nullable: true })
    tag?: BlogTagType;

    @Field(() => GraphQLISODateTime)
    createdAt: Date;

    @Field(() => GraphQLISODateTime)
    updatedAt: Date;
}


@InputType()
export class CreateBlogInput {
    @Field() @IsString() @IsOptional() title: string;
    @Field(() => String) @IsString() @IsOptional() content: string;
    
    @Field(() => String, { nullable: true }) @IsString() @IsOptional() coverMedia?: string;

    @Field(() => String, {nullable: true}) @IsString() @IsOptional() tagId?: string | null;

    @Field(() => Status, { nullable: true }) @IsEnum(Status) @IsOptional() status?: Status;
}

@ObjectType()
export class CreateBlogResponse {
    @Field(() => String) message!: string;
    @Field(() => BlogType) blog!: BlogType;
}

@InputType()
export class EditBlogInput {
    @Field({ nullable: true }) @IsOptional() @IsString() title?: string;

    @Field({ nullable: true }) @IsOptional() @IsString() content?: string;

    @Field({ nullable: true }) @IsOptional() @IsString() coverMedia?: string;

    @Field(() => ID, { nullable: true }) @IsOptional() @IsString() tagId?: string;

    @Field(() => Status, { nullable: true }) @IsOptional() @IsEnum(Status) status?: Status;
}

@InputType()
export class BlogFilterInput {
    @Field({ nullable: true }) @IsOptional() @IsString() search?: string;
    @Field(() => Status, { nullable: true }) @IsOptional() @IsEnum(Status) status?: Status;
    
    @Field(() => ID, { nullable: true }) @IsOptional() @IsString() tagId?: string;

    @Field(() => String, { nullable: true }) @IsOptional() @IsString() dateRangePreset?: string;
    @Field(() => Date, { nullable: true }) @IsOptional() @IsDate() startDate?: Date;

    @Field(() => Date, { nullable: true }) @IsOptional() @IsDate() endDate?: Date;

    @Field(() => Int, { nullable: true, defaultValue: 1 }) @IsNumber() @IsOptional() page?: number;

    @Field(() => Int, { nullable: true, defaultValue: 10 }) @IsNumber() @IsOptional() pageSize?: number;
}

@ObjectType()
export class PaginatedBlogs {
    @Field(() => [BlogType]) data: BlogType[];
    @Field() total: number;
    @Field() page: number;
    @Field() pageSize: number;
}