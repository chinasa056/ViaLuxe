import { Module } from '@nestjs/common';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from './prisma/prisma.service';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { GqlAuthGuard } from './jwt/gqlauth.guard';
import { GlobalGqlExceptionFilter } from './common/error/gql-exception.filter';
import { CompressionService } from './common/utils/compression.service';
import { BlogModule } from './blog/blog.module';
import { TourPackageModule } from './tour-package/tour-package.module';
import { TourTypeModule } from './tour-type/tour-type.module';
import { DestinationTravelModule } from './destination-travel/destination-travel.module';
import { VisaChecklistModule } from './visa-checklist/visa-checklist.module';
import { EmailSubscriberModule } from './email-subscriber/email-subscriber.module';
import { PricingOptionModule } from './pricing-option/pricing-option.module';
import { BlogTagModule } from './blog-tag/blog-tag.module';
import { RequestModule } from './request/request.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      introspection: true, 
      debug: process.env.NODE_ENV !== 'production',
      sortSchema: true,


      context: (contextParams) => {
        const { req, res, connection, extra } = contextParams;

        // Handle WebSocket subscriptions (connection exists for subscriptions)
        if (connection) {
          const connectionHeaders = connection.context || {};

          return {
            req: {
              headers: {
                // Map the Authorization from connectionParams to the expected header format
                authorization:
                  connectionHeaders.Authorization ||
                  connectionHeaders.authorization,
                ...connectionHeaders,
              },
              logIn: () => Promise.resolve(),
            },
          };
        }

        // Check if this is a WebSocket connection without connection param (legacy)
        // This might be the case based on your logs
        if (!req && extra && Object.keys(extra).includes('Authorization')) {
          return {
            req: {
              headers: {
                authorization: extra.Authorization || extra.authorization,
                ...extra,
              },
              logIn: () => Promise.resolve(),
            },
          };
        }

        // If we have direct Authorization in the contextParams (another WebSocket case)
        if (!req && !connection && contextParams.Authorization) {
          return {
            req: {
              headers: {
                authorization:
                  contextParams.Authorization || contextParams.authorization,
                ...contextParams,
              },
              logIn: () => Promise.resolve(),
            },
          };
        }

        // grab the token whether via HTTP header or WS connectionParams
        const authHeader = req
          ? req.headers.authorization
          : extra?.headers?.authorization;

        // GraphQL resolve context shape:
        if (req) {
          // HTTP request
          return { req, res };
        }
        if (extra?.headers) {
          // WS connection, wrap headers into a fake req
          return { req: { headers: extra.headers } };
        }

        // ADDED: Fallback to prevent undefined req
        // This ensures req always exists, even in edge cases
        return {
          req: {
            headers: {},
            // Add empty logIn method if your code tries to call it
            logIn: () => Promise.resolve(),
          },
        };
      },

      subscriptions: {
        'graphql-ws': {
          onConnect: (ctx) => {
            // Return the connection params directly - this becomes connection.context
            return ctx.connectionParams || {};
          },
        },
        // legacy transport, if you still need it:
        'subscriptions-transport-ws': {
          path: '/graphql', 
          onConnect: (connectionParams) => { 
            return connectionParams || {};
          },
        },  
      },

      playground: true,

      formatError: (err) => {
        // unwrap our GraphQLError into minimal shape........
        return {
          message: err.message,
          code: err.extensions?.code,
          errors: err.extensions?.errors || [],
        };
      },
    }),

    AuthModule,
    // InviteModule,
     BlogModule, TourPackageModule, TourTypeModule, DestinationTravelModule, VisaChecklistModule, EmailSubscriberModule, PricingOptionModule, BlogTagModule, RequestModule
  ],

  providers: [
    PrismaService,
    // RedisProvider,
    CompressionService, // <-- Add CompressionService here
    { provide: APP_GUARD, useClass: GqlAuthGuard },
    {
      provide: APP_FILTER,
      useClass: GlobalGqlExceptionFilter,
    },
    // { provide: APP_INTERCEPTOR, useClass: GlobalGraphQLCacheInterceptor },
  ],
  exports: [PrismaService, CompressionService], 
}) 
export class AppModule {}
