import { Field, ID, InputType, ObjectType } from "@nestjs/graphql";
import { IsUUID } from "class-validator";

@ObjectType()
export class NotificationSettings {
    @Field(() => ID) id: string;
    @Field(() => ID) userId: string;
    @Field() appointmentNotification: boolean;
    @Field() articleNotification: boolean;
    @Field() insightsNotification: boolean;
}

@InputType()
export class UpdateNotificationSettingsInput {
    @Field(() => ID)
    @IsUUID()
    userId: string;
    @Field() appointmentNotification: boolean;
    @Field() articleNotification: boolean; 
    @Field() insightsNotification: boolean;
} 