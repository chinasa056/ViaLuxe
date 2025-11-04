import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';
import { PrismaService } from '../prisma/prisma.service';
import {
  ChangePasswordInput,
  ChangePasswordResponse,
  RequestPasswordResetInput,
  ResetPasswordInput,
  ResetPasswordResponse,
  ResetResult,
} from 'src/dtos';
import {
  PASSWORD_MIN_LENGTH,
  PASSWORD_REQUIREMENTS,
  PASSWORD_REQUIREMENTS_MESSAGE,
  PASSWORD_RESET_TOKEN_EXPIRATION,
} from './auth.constants';
import * as bcrypt from 'bcryptjs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PasswordService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService,
  ) {}

  private validatePassword(password: string): void {
    const meetsAll =
      password.length >= PASSWORD_MIN_LENGTH &&
      PASSWORD_REQUIREMENTS.every((rx) => rx.test(password));
    if (!meetsAll) {
      throw new HttpException(
        PASSWORD_REQUIREMENTS_MESSAGE,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  private verifyPasswordResetToken(token: string): any {
    try {
      const payload = this.jwtService.verify(token);
      if (payload.purpose !== 'password-reset') {
        throw new HttpException('Invalid token purpose', HttpStatus.BAD_REQUEST);
      }
      return payload;
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new HttpException('Token expired', HttpStatus.BAD_REQUEST);
      }
      throw new HttpException('Invalid token', HttpStatus.BAD_REQUEST);
    }
  }

  async requestPasswordReset(
    data: RequestPasswordResetInput,
  ): Promise<ResetPasswordResponse> {

    if (!data.email) {
      throw new HttpException('Email is required', HttpStatus.BAD_REQUEST);
    }
    const user = await this.prisma.user.findUnique({
      where: { email: data.email },
    }); 

    if (user) {
      const resetToken = this.jwtService.sign(
        { email: user.email, purpose: 'password-reset' },
        { expiresIn: PASSWORD_RESET_TOKEN_EXPIRATION },
      );
      // URL should come from a config file in a real app
      const resetLink = `https://aedionai.expo.app/reset-password?token=${resetToken}`;
      await this.mailerService.sendMail({
        to: user.email,
        subject: 'Password Reset Request',
        template: './reset-password', 
        context: {resetLink},
      });
      // Return the link only in dev/test environments for convenience
      if (process.env.NODE_ENV !== 'production') {
        return { message: 'Password reset link sent', resetLink };
      }
    }
    return {
      message:
        'If an account with this email exists, a password reset link has been sent.',
      resetLink: '',
    };
  }

  async resetUserPassword(data: ResetPasswordInput): Promise<ResetResult> {
    const payloadJwt = this.verifyPasswordResetToken(data.token);

    const user = await this.prisma.user.findUnique({
      where: { email: payloadJwt.email },
    });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    this.validatePassword(data.newPassword);
    if (data.newPassword !== data.confirmNewPassword) {
      throw new HttpException(
        'New password and confirm password do not match',
        HttpStatus.BAD_REQUEST,
      );
    }

    const hashed = await bcrypt.hash(data.newPassword, 10);
    await this.prisma.user.update({
      where: { id: user.id },
      data: { passwordHash: hashed },
    });
    return { message: 'Password updated successfully' };
  }

  async changePassword(
    userId: string,
    data: ChangePasswordInput,
  ): Promise<ChangePasswordResponse> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const isOldPasswordValid = await bcrypt.compare(
      data.currentPassword,
      user.passwordHash,
    );
    if (!isOldPasswordValid) {
      throw new HttpException(
        'Current password is incorrect',
        HttpStatus.BAD_REQUEST,
      );
    }

    this.validatePassword(data.newPassword);

    if (data.newPassword !== data.confirmNewPassword) {
      throw new HttpException(
        'New password and confirm password do not match',
        HttpStatus.BAD_REQUEST,
      );
    }

    const hashedPassword = await bcrypt.hash(data.newPassword, 10);
    await this.prisma.user.update({
      where: { id: userId },
      data: { passwordHash: hashedPassword },
    });

    return { message: 'Password updated successfully' };
  }
}