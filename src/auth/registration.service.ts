import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateUserInput,
  CreateUserResponse,
} from 'src/dtos';
import {
  PASSWORD_MIN_LENGTH,
  PASSWORD_REQUIREMENTS,
  PASSWORD_REQUIREMENTS_MESSAGE,
} from './auth.constants';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class RegistrationService {
  private readonly logger = new Logger(RegistrationService.name);

  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async signupUser(data: CreateUserInput): Promise<CreateUserResponse> {
    const existing = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existing) {
      throw new HttpException(
        'An account with this email already exists.',
        HttpStatus.CONFLICT,
      );
    }

    this.validatePassword(data.password);
    const passwordHash = await bcrypt.hash(data.password, 10);

    const newUser = await this.prisma.user.create({
      data: {
        email: data.email,
        passwordHash,
        firstName: data.firstName,
        lastName: data.lastName || null,
      },
    });

    const userForResponse = {
      ...newUser,
      lastName: newUser.lastName === null ? undefined : newUser.lastName,
    };

    return {
      message: 'User registered successfully',
      user: userForResponse,
    };
  }

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
}
