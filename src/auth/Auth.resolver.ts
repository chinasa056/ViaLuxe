import { Resolver, Mutation, Query, Args, Context } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { Public } from 'src/jwt/public.decorator';
import {
  AuthPayload,
  ChangePasswordInput,
  ChangePasswordResponse,
  CreateUserInput,
  CreateUserResponse,
  // TokenExpiryResponse,
  LoginUserInput,
  RefreshTokenResponse,
  RequestPasswordResetInput,
  ResetPasswordInput,
  ResetPasswordResponse,
  ResetResult,
  UpdatePersonalInfoInput,
  UpdatePersonalInfoResponse,
  UserType,
  VerifyEmailCodeInput,
  VerifyEmailCodeResponse,
} from 'src/dtos';
import { User } from '@prisma/client';
import { CurrentUser } from 'src/jwt/current-user.decorator';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  //Sign Up User
  @Public()
  @Mutation(() => CreateUserResponse, { name: 'signUp' })
  async signUp(@Args('data', { type: () => CreateUserInput }) data: CreateUserInput): Promise<CreateUserResponse> {
    return this.authService.signUp(data);
  }

  //Login User
  @Public()
  @Mutation(() => AuthPayload, { name: 'login' })
  login(
    @Args('data', { type: () => LoginUserInput }) data: LoginUserInput,
  ): Promise<AuthPayload> {
    return this.authService.login(data);
  }

  // Refresh Token
  @Public()
  @Mutation(() => RefreshTokenResponse, { name: 'refreshToken' })
  async refreshToken(
    @Context() context: any,
    @Args('token', { nullable: true }) token?: string,
  ): Promise<RefreshTokenResponse> {
    return this.authService.refreshToken(context.req, token);
  }

  //Fetch All Accounts
  @Query(() => [UserType], { name: 'users' })
  users(): Promise<User[]> {
    return this.authService.fetchAllAccount();
  }

  //Fetch Single Account
  @Query(() => UserType, { name: 'user' })
  user(@Args('id', { type: () => String }) id: string): Promise<User> {
    return this.authService.fetchOneAccount(id);
  }

  //Request Password Reset
  @Public()
  @Mutation(() => ResetPasswordResponse, { name: 'requestPasswordReset' })
  requestPasswordReset(
    @Args('data', { type: () => RequestPasswordResetInput })
    data: RequestPasswordResetInput,
  ): Promise<ResetPasswordResponse> {
    return this.authService.requestPasswordReset(data);
  }

  //Reset Password
  @Public()
  @Mutation(() => ResetResult, { name: 'resetPassword' })
  resetPassword(
    @Args('data', { type: () => ResetPasswordInput })
    data: ResetPasswordInput,
  ): Promise<ResetResult> {
    return this.authService.resetUserPassword(data);
  }

  //Update Personal Info
  @Mutation(() => UpdatePersonalInfoResponse)
  async updatePersonalInfo(
    @Args('userId') userId: string,
    @Args('data') data: UpdatePersonalInfoInput,
  ): Promise<UpdatePersonalInfoResponse> {
    return this.authService.updatePersonalInfo(userId, data);
  }

  //Change Password
  @Mutation(() => ChangePasswordResponse)
  async changePassword(
    @Args('userId') userId: string,
    @Args('data') data: ChangePasswordInput,
  ): Promise<ChangePasswordResponse> {
    return this.authService.changePassword(userId, data);
  }

  //Get Current User Info (Me)
  @Query(() => UserType)
  async getCurrentUser(
    @CurrentUser('userId') userId: string,
    @Context() context: any,
  ): Promise<User> {
    return this.authService.getMe(userId);
  }


}

// Check Token Expiry
// @Query(() => TokenExpiryResponse, { name: 'checkTokenExpiry' })
// async checkTokenExpiry(@CurrentUser('userId') userId: string): Promise<TokenExpiryResponse> {
//   return this.authService.checkTokenExpiry(userId);
// }
