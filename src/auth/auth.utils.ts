import { User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import {
  ACCESS_TOKEN_EXPIRATION,
  REFRESH_TOKEN_EXPIRATION,
} from './auth.constants';

/**
 * Defines the structure of the JWT payload for type safety.
 */
export interface JwtPayload {
  sub: string; // 'sub' (subject) is the standard claim for user ID
  email: string;
  firstName: string;
  lastName: string | null;
}

/**
 * Defines the structure of the Refresh JWT payload.
 */
export interface RefreshJwtPayload {
  sub: string; // User ID
  purpose: 'refresh-token';
}

export function createJwtPayload(user: User): JwtPayload {
  return {
    sub: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName
  };
}

/**
 * Generates a new access and refresh token for a given user.
 * @param jwtService The JwtService instance.
 * @param user The user object to generate tokens for.
 * @returns An object containing the accessToken and refreshToken.
 */
export function generateTokens(jwtService: JwtService, user: User): { accessToken: string; refreshToken: string } {
  const accessToken = jwtService.sign(createJwtPayload(user), {
    expiresIn: ACCESS_TOKEN_EXPIRATION,
  });

  const refreshTokenPayload: RefreshJwtPayload = {
    sub: user.id,
    purpose: 'refresh-token',
  };

  const refreshToken = jwtService.sign(refreshTokenPayload, {
    expiresIn: REFRESH_TOKEN_EXPIRATION,
  });

  return { accessToken, refreshToken };
}
