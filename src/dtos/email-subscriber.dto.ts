import { Field, GraphQLISODateTime, ID, InputType, ObjectType, Int } from "@nestjs/graphql";
import { IsEmail, IsNotEmpty, IsString, IsOptional } from "class-validator";

@ObjectType()
export class EmailSubscriberType {
    @Field(() => ID) id: string;
    @Field() email: string;
    @Field(() => GraphQLISODateTime) createdAt: Date;
    @Field(() => GraphQLISODateTime) updatedAt: Date;
}

@InputType()
export class CreateEmailSubscriberInput {
    @Field() @IsEmail() @IsNotEmpty() email: string;
}

@ObjectType()
export class EmailSubscriberResponse {
    @Field(() => String) message!: string;
    @Field(() => EmailSubscriberType, { nullable: true })
    subscriber?: EmailSubscriberType;
}

@ObjectType()
export class PaginatedEmailSubscribers {
    @Field(() => [EmailSubscriberType]) data: EmailSubscriberType[];
    @Field() total: number;
    @Field() page: number;
    @Field() pageSize: number;
}