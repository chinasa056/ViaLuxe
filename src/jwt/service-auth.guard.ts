
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class ServiceAuthGuard implements CanActivate {
  private readonly logger = new Logger(ServiceAuthGuard.name);
  
  constructor(private configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const gqlContext = GqlExecutionContext.create(context);
    const contextData = gqlContext.getContext();
    
    // Extract service token from headers
    const req = contextData.req;
    const serviceToken = req?.headers['x-service-token'] ||  
                        contextData.headers?.['x-service-token'] ||
                        contextData['x-service-token'];
    
    const expectedToken = this.configService.get<string>('SERVICE_AUTH_TOKEN');
    
    this.logger.debug(`Service token provided: ${!!serviceToken}`);
    this.logger.debug(`Expected token configured: ${!!expectedToken}`);
    
    if (!serviceToken || serviceToken !== expectedToken) {
      this.logger.error('Invalid or missing service token');
      throw new UnauthorizedException('Invalid service token');
    }
    
    this.logger.log('Service authentication successful');
    return true;
  }
}