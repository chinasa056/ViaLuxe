import { Field, ID, InputType, ObjectType } from "@nestjs/graphql";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

@ObjectType()
export class BlogTagType {
  @Field(() => ID) id: string;

  @Field() name: string;

  @Field() createdAt: Date;
  
  @Field() updatedAt: Date;
}

@InputType()
export class CreateBlogTagInput {
  @Field() @IsString() @IsNotEmpty() name: string;
}

@InputType()
export class EditBlogTagInput {
  @Field({ nullable: true }) @IsOptional() @IsString() name?: string;
}
