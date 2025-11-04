import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import {
  AuthPayload,
  LoginUserInput,
  RequestPasswordResetInput,
  ResetPasswordInput,
  ResetPasswordResponse,
  ResetResult,
  VerifyEmailCodeInput,
  VerifyEmailCodeResponse,
  ChangePasswordResponse,
  UserInput,
  UpdateUserInput,
  RefreshTokenResponse,
  UpdatePersonalInfoResponse,
  UpdatePersonalInfoInput,
  ChangePasswordInput,
  CreateUserInput,
  CreateUserResponse,
} from 'src/dtos';
import { BaseService } from 'src/services/base.service';
import { User } from '@prisma/client';
import { randomBytes } from 'crypto';
import { HttpException, Injectable, Logger, HttpStatus, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { RegistrationService } from './registration.service';
import { PasswordService } from './password.service';
import { createJwtPayload, generateTokens, RefreshJwtPayload } from './auth.utils';
import { safeUserSelect } from './auth.constants';


interface OAuthData {
  email: string;
  firstName: string;
  lastName: string;
  id?: string;
  accessToken?: string;
  refreshToken?: string;
}

@Injectable()
export class AuthService extends BaseService<User, UserInput, UpdateUserInput> {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly registrationService: RegistrationService,
    private readonly passwordService: PasswordService,

  ) {
    super(prisma, prisma.user);
  }

  async signUp(data: CreateUserInput):
    Promise<CreateUserResponse> {
    return this.registrationService.signupUser(data);
  }
  
  //LOGIN
  async login(data: LoginUserInput): Promise<AuthPayload & { refreshToken: string }> {
    const user = await this.modelDelegate.findUnique({
      where: { email: data.email },
    });
    if (!user) {
      throw new HttpException('Invalid Credentials. Please try again.', HttpStatus.UNAUTHORIZED);
    }

    const valid = await bcrypt.compare(data.password, user.passwordHash);
    if (!valid) {
      throw new HttpException('Invalid Credentials. Please try again.', HttpStatus.UNAUTHORIZED);
    }
    const tokens = generateTokens(this.jwtService, user);
    const { passwordHash, ...safeUser } = user; 
    return { ...tokens, user: safeUser };
  };

  //SOCIALITE LOGIN
  async oauthLogin(
    provider: 'google' | 'facebook' | 'apple',
    oauthData: OAuthData,
  ): Promise<any> {
    if (!oauthData.id) {
      throw new HttpException('OAuth provider did not return user ID', HttpStatus.BAD_REQUEST);
    }

    this.logger.log(`Processing OAuth login for email: ${oauthData.email}`);

    // Use a single `upsert` operation to find or create the user.
    // This is more efficient than multiple separate queries.
    const tempPassword = randomBytes(16).toString('hex');
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    const user = await this.prisma.user.upsert({
      where: { email: oauthData.email },
      update: {
        // If user exists, update their info from OAuth provider if needed.
        // For example, update the profile picture if it's missing or has changed.
        firstName: oauthData.firstName,
        lastName: oauthData.lastName,
        // We don't update the ID here, preserving the original user ID.
      },
      create: {
        // If user does not exist, create them.
        // We use the Google ID as our primary key for new social logins.
        id: oauthData.id,
        email: oauthData.email,
        firstName: oauthData.firstName,
        lastName: oauthData.lastName,
        passwordHash: hashedPassword, // A random password for users 
        // Mark email as verified since it's from a trusted OAuth provider
        isVerified: true,
      },
    });

    this.logger.log(`User ${user.email} (ID: ${user.id}) processed for OAuth login.`);

    const tokens = generateTokens(this.jwtService, user);
    const { passwordHash, ...safeUser } = user; // eslint-disable-line @typescript-eslint/no-unused-vars

    this.logger.log('JWT token generated successfully');

    return { ...tokens, user: safeUser as User };
  }


  async refreshToken(req: any, tokenFromArgs?: string): Promise<RefreshTokenResponse> {
    let payload: RefreshJwtPayload;
    // Prioritize token from cookie (web), fallback to argument (mobile)
    const token = req.cookies?.refreshToken ?? tokenFromArgs;

    if (!token) {
      throw new UnauthorizedException('No refresh token provided.');
    }

    try {
      payload = this.jwtService.verify<RefreshJwtPayload>(token);
      if (payload.purpose !== 'refresh-token') {
        throw new UnauthorizedException('Invalid token purpose');
      }
    } catch (error) {
      // This catches expired tokens, malformed tokens, etc.
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    const user = await this.prisma.user.findUnique({ where: { id: payload.sub } });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // With a stateless approach, we simply issue a new set of tokens.
    // For added security, you could implement refresh token rotation here,
    // but that would require some state, which we are avoiding.
    return generateTokens(this.jwtService, user);
  }

  //FETCH ALL
  async fetchAllAccount(): Promise<User[]> {
    return await super.findAll();
  }

  //FETCH ONE
  async fetchOneAccount(id: string): Promise<User> {
    return await super.findOne(id);
  }

  //REQUEST PASSWORD RESET
  async requestPasswordReset(
    data: RequestPasswordResetInput,
  ): Promise<ResetPasswordResponse> {
    return this.passwordService.requestPasswordReset(data);
  }

  //RESET PASSWORD
  async resetUserPassword(data: ResetPasswordInput): Promise<ResetResult> {
    return this.passwordService.resetUserPassword(data);
  }



  async updatePersonalInfo(
    userId: string,
    data: UpdatePersonalInfoInput,
  ): Promise<UpdatePersonalInfoResponse> {
    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
      },
      select: safeUserSelect,
    });

    return {
      message: 'Personal information updated successfully',
      user: {
        ...updatedUser,
        lastName: updatedUser.lastName === null ? undefined : updatedUser.lastName,
      },
    };
  }

  async changePassword(
    userId: string,
    data: ChangePasswordInput,
  ): Promise<ChangePasswordResponse> {
    return this.passwordService.changePassword(userId, data);
  }

  //GET CURRENT USER INFO (ME)
  async getMe(userId: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: safeUserSelect,
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return user as User;
  }


}