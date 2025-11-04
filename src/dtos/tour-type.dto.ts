import { Field, ID, InputType, ObjectType } from "@nestjs/graphql";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

@ObjectType()
export class TourType {
  @Field(() => ID) id: string;

  @Field() name: string;

  @Field() createdAt: Date;
  
  @Field() updatedAt: Date;
}

@InputType()
export class CreateTourTypeInput {
  @Field() @IsString() @IsNotEmpty() name: string;
}

@InputType()
export class EditTourTypeInput {
  @Field({ nullable: true }) @IsOptional() @IsString() name?: string;
}
