// common/error/gql-exception.filter.ts - Fixed version
import { Catch, ArgumentsHost, Logger } from '@nestjs/common';
import { GqlExceptionFilter, GqlArgumentsHost } from '@nestjs/graphql';
import { GraphQLError } from 'graphql';
import { formatError } from './format-error.util';

@Catch()
export class GlobalGqlExceptionFilter implements GqlExceptionFilter {
  private readonly logger = new Logger(GlobalGqlExceptionFilter.name);

  catch(exception: any, host: ArgumentsHost): GraphQLError {
    const gqlHost = GqlArgumentsHost.create(host);
    
    // Log the exception for debugging
    this.logger.error('GraphQL exception thrown:', exception);
    if (exception?.stack) {
      this.logger.error(exception.stack);
    }

    // Format the error using your existing utility
    const { statusCode, message, errors } = formatError(exception);

    // Map HTTP status codes to GraphQL error codes
    const getGraphQLCode = (status: number): string => {
      switch (status) {
        case 400: return 'BAD_USER_INPUT';
        case 401: return 'UNAUTHENTICATED';
        case 403: return 'FORBIDDEN';
        case 404: return 'NOT_FOUND';
        case 422: return 'GRAPHQL_VALIDATION_FAILED';
        case 500: return 'INTERNAL_SERVER_ERROR';
        default: return 'INTERNAL_SERVER_ERROR';
      }
    };

    // Return a proper GraphQL error
    return new GraphQLError(message, {
      extensions: {
        code: getGraphQLCode(statusCode),
        statusCode,
        ...(errors ? { errors } : {}),
      },
    });
  }
} 