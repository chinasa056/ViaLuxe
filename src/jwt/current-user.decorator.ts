import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const CurrentUser = createParamDecorator(
  (data: string | undefined, context: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(context); 
    const contextData = ctx.getContext();
    
    // Handle different context structures
    let request = contextData.req;
    
    // If req doesn't exist, check if user is directly in context
    // (This can happen with WebSocket subscriptions)
    if (!request) {
      // Check if user is directly in contextData
      if (contextData.user) {
        const user = contextData.user;
        if (data) {
          return user[data];
        }
        return user;
      }
      
      // If we have connection context (WebSocket), user might be there
      if (contextData.connection?.context?.user) {
        const user = contextData.connection.context.user;
        if (data) {
          return user[data];
        }
        return user;
      }
      
      throw new UnauthorizedException('User not authenticated - no request context');
    }
    
    const user = request.user;
    if (!user) {
      throw new UnauthorizedException('User not authenticated');
    } 

    if (data) {
      return user[data];
    }
    
    return user;
  },
);