import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy, StrategyOptionsWithoutRequest } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from 'src/auth/auth.utils';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name);

  constructor(config: ConfigService) {
    const secret = config.get('JWT_SECRET');
    if (!secret) {
      throw new UnauthorizedException('Missing JWT_SECRET');  
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    } as StrategyOptionsWithoutRequest);

    this.logger.debug(`→ [JwtStrategy] Initialized with secret: ${secret.substring(0, 8)}...`);
  }

  async validate(payload: JwtPayload) {
    this.logger.debug(`→ [JwtStrategy.validate] Full payload received`);

    if (!payload.sub || !payload.email) {
      this.logger.error(
        `→ [JwtStrategy.validate] Missing 'sub' or 'email' in payload`,
      );
      throw new UnauthorizedException(
        'Invalid token: core user identification is missing',
      );
    }

    // The object returned here will be attached to the request as `req.user`
    // We rename 'sub' to 'userId' for consistency in our app context.
    const { sub: userId, ...restOfPayload } = payload;
    const userContext = { userId, ...restOfPayload };

    this.logger.debug(`→ [JwtStrategy.validate] User context created:`, { userId: userContext.userId, email: userContext.email });
    return userContext;
  }
}
