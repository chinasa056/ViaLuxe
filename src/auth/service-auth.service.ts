import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';

// Define a type for the user data to be passed in the token.
// This makes it clear what information is being shared between services.
export type ServiceTokenUserPayload = Pick<
  User,
  'id' | 'email' | 'firstName' | 'lastName'
>;

@Injectable()
export class ServiceAuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Generate a service-to-service JWT token that contains user context.
   * @param user The user object containing info for the payload.
   * @param sessionId Optional session ID.
   */
  generateServiceToken(
    user: ServiceTokenUserPayload, 
    sessionId?: string,
  ): string {
    const payload = {
      sub: user.id,
      sessionId,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      iat: Math.floor(Date.now() / 1000),
      iss: this.configService.get('SERVICE_JWT_ISSUER', 'aedion-service'),
      aud: this.configService.get(
        'SERVICE_JWT_AUDIENCE',
        'aedion-ai-python-service',
      ),
      type: 'service-auth',
    };

    return this.jwtService.sign(payload, {
      secret: this.configService.get('SERVICE_JWT_SECRET'),
      expiresIn: '1h',
    });
  }

  /**
   * Verifies a service token. This is used to validate tokens from other
   * services that are authorized to communicate with this one.
   */
  verifyServiceToken(token: string): {
    userId: string;
    sessionId?: string;
    email: string;
    firstName: string;
    lastName: string | null;
    gender: string;
  } {
    try {
      const payload = this.jwtService.verify(token, {
        secret: this.configService.get('SERVICE_JWT_SECRET'),
        audience: this.configService.get(
          'SERVICE_JWT_ISSUER',
          'aedion-service',
        ),
      });

      // Validate token structure
      if (payload.type !== 'service-auth') {
        throw new UnauthorizedException(
          "Invalid service token type: expected 'service-auth'",
        );
      }

      return {
        userId: payload.sub,
        sessionId: payload.sessionId,
        email: payload.email,
        firstName: payload.firstName,
        lastName: payload.lastName,
        gender: payload.gender,
      };
    } catch (error) {
      throw new UnauthorizedException(`Invalid service token: ${error.message}`);
    }
  }
}
