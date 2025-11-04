// src/dtos/user.dto.ts

import {
  ObjectType,
  Field,
  InputType,
  PartialType,
  ID,
  GraphQLISODateTime,
} from '@nestjs/graphql';
import {
  IsEmail,
  MinLength,
  IsOptional,
  IsDateString,
  IsUUID,
  IsString,
  IsNotEmpty,
  IsEnum,
} from 'class-validator';
import { GenderType } from 'src/common/enums';

@ObjectType()
export class UserType {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  email: string;

  @Field(() => String)
  firstName: string;

  @Field(() => String, { nullable: true })
  lastName?: string | null;
}

@InputType()
export class CreateUserInput {
  @Field(() => String)
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Field(() => String)
  @MinLength(6)
  @IsNotEmpty()
  @IsString()
  password: string;

  @Field(() => String) 
  @IsString() 
  @IsNotEmpty()
  firstName: string;

  @Field(() => String,  { nullable: true }) 
  @IsOptional() 
  lastName?: string;
}

@ObjectType()
export class CreateUserResponse {
  @Field() message!: string;
  @Field(() => UserType) user!: UserType;
}

@InputType()
export class StartRegistrationInput {
  @Field() @IsEmail() email!: string;
}

@ObjectType()
export class StartRegistrationResponse {
  @Field() message!: string;
}

@InputType()
export class VerifyEmailCodeInput {
  @Field() @IsEmail() email!: string;
  @Field() @IsNotEmpty() code!: string;
}

@ObjectType()
export class VerifyEmailCodeResponse {
  @Field() registrationToken!: string;
}

@InputType()
export class CompleteProfileInput {
  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  registrationToken: string;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @Field(() => String, { nullable: true })
  @IsDateString()
  @IsOptional()
  dateOfBirth?: string;

  @Field(() => GenderType, { nullable: true })
  @IsString()
  @IsOptional()
  gender?: GenderType;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  profilePicture?: string;
}

// @ObjectType()
// export class CompleteProfileResponse {
//   @Field() message!: string;
//   @Field(() => String, { nullable: true })
//   registrationToken?: string;
// }

// @InputType()
// export class FinalizeRegistrationInput {
//   @Field(() => String)
//   @IsString()
//   @IsNotEmpty()
//   registrationToken: string;

//   @Field() @MinLength(8) @IsNotEmpty() password!: string;
// }

@InputType()
export class UserInput {
  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsUUID()
  id?: string;

  @Field(() => String)
  @IsEmail()
  email: string;

  @Field(() => String)
  @IsString()
  @MinLength(6)
  password: string;

  @Field(() => String)
  @IsString()
  firstName: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  lastName?: string;
}

@InputType()
export class LoginUserInput {
  @Field(() => String)
  @IsEmail()
  email: string;

  @Field(() => String)
  @IsString()
  @MinLength(6)
  password: string;
}

@InputType()
export class UpdateUserInput extends PartialType(UserInput) {
  @Field(() => ID)
  @IsUUID()
  id: string;
}


@ObjectType()
export class AuthPayload {
  @Field(() => String)
  accessToken: string;

  @Field(() => String)
  refreshToken: string;

  @Field(() => UserType)
  user: UserType;
}

@ObjectType()
export class RefreshTokenResponse {
  @Field(() => String)
  accessToken: string;

  @Field(() => String)
  refreshToken: string;
}

@ObjectType()
export class FinalizeRegistrationResponse {
  @Field() message!: string;

  @Field(() => String, { nullable: true })
  accessToken?: string;

  @Field(() => String, { nullable: true })
  refreshToken?: string;

  @Field(() => UserType) user!: UserType;
}

@ObjectType()
export class RegisterResponse {
  @Field(() => UserType)
  user!: UserType;

  @Field()
  message!: string;
}

@InputType()
export class RequestPasswordResetInput {
  @Field(() => String)
  @IsEmail()
  email: string;
}

@ObjectType()
export class ResetPasswordResponse {
  @Field(() => String)
  message: string;

  @Field(() => String)
  resetLink: string;
}

@InputType()
export class ResetPasswordInput {
  @Field(() => String)
  @IsString()
  token: string;

  @Field(() => String)
  @IsString()
  @MinLength(8)
  newPassword: string;

  @Field(() => String)
  @IsString()
  @MinLength(8)
  confirmNewPassword: string;
}

@ObjectType()
export class ResetResult {
  @Field(() => String)
  message: string;
}

@InputType()
export class UpdatePersonalInfoInput {
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  firstName?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  lastName?: string;
}

@ObjectType()
export class UpdatePersonalInfoResponse {
  @Field(() => String)
  message: string;

  @Field(() => UserType)
  user: UserType;
}

@InputType()
export class ChangePasswordInput {
  @Field(() => String)
  @IsString()
  currentPassword: string;

  @Field(() => String)
  @IsString()
  @MinLength(6)
  newPassword: string;

  @Field(() => String)
  @IsString()
  @MinLength(6)
  confirmNewPassword: string;
}

@ObjectType()
export class ChangePasswordResponse {
  @Field(() => String)
  message: string;
}

@ObjectType()
export class LogoutResponse {
  @Field(() => String)
  message: string;
}

@ObjectType()
export class DeleteAccountResponse {
  @Field(() => String)
  message: string;

  @Field(() => UserType)
  user: UserType;
}

@InputType()
export class StartWebRegistrationInput {
  @Field() @IsEmail() email!: string;

  @Field() @MinLength(8) @IsNotEmpty() password!: string;
}

@ObjectType()
export class StartWebRegistrationResponse {
  @Field() message!: string;
}

@InputType()
export class CompleteWebProfileInput {
  @Field() @IsString() @IsNotEmpty() registrationToken!: string;

  @Field() @IsString() @IsNotEmpty() fullname!: string;

  @Field(() => GenderType, { nullable: true })
  @IsOptional()
  @IsEnum(GenderType)
  gender?: GenderType;
}

@ObjectType()
export class CompleteWebProfileResponse {
  @Field() message!: string;

  @Field(() => String, { nullable: true })
  accessToken?: string;

  @Field(() => String, { nullable: true })
  refreshToken?: string;

  @Field(() => UserType)
  user!: UserType;

  @Field(() => GenderType, { nullable: true })
  gender?: GenderType;
}
