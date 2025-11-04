// gqlauth.guard.ts - Fixed version with proper user attachment
import { ExecutionContext, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../jwt/public.decorator';
import { SERVICE_AUTH_KEY } from './service-auth.decorator';
import { ServiceAuthService } from 'src/auth/service-auth.service';

@Injectable()
export class GqlAuthGuard extends AuthGuard('jwt') {
  private readonly logger = new Logger(GqlAuthGuard.name);

  constructor(
    private reflector: Reflector,
    private serviceAuthService: ServiceAuthService,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const gqlCtx = GqlExecutionContext.create(context);
    const handler = gqlCtx.getHandler();
    const contextData = gqlCtx.getContext();

    // 1) If the resolver is marked @Public(), skip auth
    if (this.reflector.get<boolean>(IS_PUBLIC_KEY, handler)) {
      this.logger.log(`→ [Auth] public endpoint`);
      return true;
    }

    // 2) If the resolver is marked @ServiceAuth(), skip JWT auth 
    // (ServiceAuthGuard will handle authentication separately)
    if (this.reflector.get<boolean>(SERVICE_AUTH_KEY, handler)) {
      this.logger.log(
        `→ [Auth] service auth endpoint, skipping JWT validation`,
      );
      return true;
    }

    // 3) Check if this is a service token request
    const req = contextData.req || contextData;
    const authHeader = req?.headers?.authorization;
    const isServiceAuth = req?.headers?.['x-service-auth'] === 'true';

    if (authHeader && isServiceAuth) {
      this.logger.log(`→ [Auth] Detected service token, validating...`);
      
      try {
        // Extract token from Bearer header
        const token = authHeader.replace('Bearer ', '');
        const serviceTokenData = this.serviceAuthService.verifyServiceToken(token);
        
        // Create a mock user object similar to what JWT strategy would create
        const mockUser = {
          userId: serviceTokenData.userId,
          email: `service-user-${serviceTokenData.userId}@internal.service`,
          sessionId: serviceTokenData.sessionId,
          isServiceAuth: true,
        };
        
        // Attach user to request for downstream use
        if (contextData.req) {
          contextData.req.user = mockUser;
        } else {
          // If no req object, attach user directly to context
          contextData.user = mockUser;
        }
        
        this.logger.log(`→ [Auth] Service token validated for user: ${serviceTokenData.userId}`);
        return true;
      } catch (error) {
        this.logger.error(`→ [Auth] Service token validation failed: ${error.message}`);
        throw new UnauthorizedException('Invalid service token');
      }
    }

    // 4) Otherwise run the built‑in JWT guard
    try {
      const jwtOk = (await super.canActivate(context)) as boolean;
      if (!jwtOk) {
        this.logger.warn(`→ [Auth] JWT validation failed`);
        return false;
      }

      // 5) After JWT validation, ensure user is properly attached
      // The JWT strategy should have attached user to the request
      // But if req was created as a mock, we need to ensure user propagation
      const request = this.getRequest(context);
      if (request && request.user) {
        // Ensure user is available in the GraphQL context
        if (contextData.req) {
          contextData.req.user = request.user;
        } else {
          contextData.user = request.user;
        }
        this.logger.debug(`→ [Auth] User attached to context:`, { 
          userId: request.user.userId, 
          email: request.user.email 
        });
      }

      return true;
    } catch (error) {
      this.logger.error(`→ [Auth] Authentication error: ${error.message}`);
      throw error;
    }
  }

  // Ensure the GraphQL request object is used by Passport
  getRequest(context: ExecutionContext) {
    const gqlContext = GqlExecutionContext.create(context);
    const contextData = gqlContext.getContext();

    const req = contextData.req;

    // ADDED: Safety check to prevent undefined errors
    if (!req) {
      this.logger.debug(`→ [Auth] Request object is undefined in context`);
      this.logger.debug(
        `→ [Auth] Available context keys:`,
        Object.keys(contextData),
      );

      // Check if Authorization is directly in the context (WebSocket case)
      if (contextData.Authorization) {
        const mockReq = {
          headers: {
            authorization: contextData.Authorization,
          },
          user: null, // Will be set by JWT strategy
          logIn: () => Promise.resolve(),
        };
        
        // Store the mock request back in context for later use
        contextData.req = mockReq;
        return mockReq;
      }

      // For subscriptions, create a minimal req object
      const mockReq = {
        headers: contextData.connection?.context || contextData.headers || {},
        user: null, // Will be set by JWT strategy
        logIn: () => Promise.resolve(),
      };
      
      // Store the mock request back in context for later use
      contextData.req = mockReq;
      return mockReq;
    }

    return req;
  }
}