// import {
//   Injectable,
//   NestInterceptor,
//   ExecutionContext,
//   CallHandler,
//   Inject,
// } from '@nestjs/common';
// import { Observable, of } from 'rxjs';
// import { tap } from 'rxjs/operators';
// import { GqlExecutionContext } from '@nestjs/graphql';
// import { CACHE_MANAGER } from '@nestjs/cache-manager';
// import { Cache } from 'cache-manager';
// import { Reflector } from '@nestjs/core';
// import { convertCacheToDTO } from 'src/common/utils/conversion.utils';
// import Redis from 'ioredis';

// // Create metadata keys for cache control
// export const CACHE_DISABLED_KEY = 'cache_disabled';
// export const CACHE_TTL_KEY = 'cache_ttl';
// export const CACHE_INVALIDATE_KEY = 'cache_invalidate';

// @Injectable()
// export class GlobalGraphQLCacheInterceptor implements NestInterceptor {
//   constructor(
//     @Inject(CACHE_MANAGER) private cacheManager: Cache,
//     private reflector: Reflector,
//     @Inject('REDIS_CLIENT') private redisClient: Redis,
//   ) {}

//   async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
//     // Check if caching is disabled for this resolver
//     const isCacheDisabled = this.reflector.get<boolean>(
//       CACHE_DISABLED_KEY,
//       context.getHandler(),
//     );

//     if (isCacheDisabled) {
//       return next.handle();
//     }

//     const gqlContext = GqlExecutionContext.create(context);
//     const info = gqlContext.getInfo();
//     const args = gqlContext.getArgs();
//     const operation = info.operation.operation; // 'query' or 'mutation'

//     // Only cache queries by default, not mutations
//     if (operation === 'mutation') {
//       // For mutations, execute and then invalidate related caches
//       return next.handle().pipe(
//         tap(async () => {
//           await this.invalidateRelatedCaches(context, info.fieldName, args, gqlContext);
//         }),
//       );
//     }

//     // For queries, implement caching
//     const cacheKey = this.generateCacheKey(info.fieldName, args, gqlContext);
    
//     try {
//       const cached = await this.cacheManager.get(cacheKey);
//       if (cached) {
//         console.log(`Cache HIT: ${cacheKey}`);
//         // Deserialize cached data to restore Date objects
//         return of(convertCacheToDTO(cached));
//       }
//       console.log(`Cache MISS: ${cacheKey}`);
//     } catch (error) {
//       console.error('Cache get error:', error);
//     }

//     // Get custom TTL or use default
//     const customTtl = this.reflector.get<number>(CACHE_TTL_KEY, context.getHandler());
//     const ttl = customTtl || this.getDefaultTtl(info.fieldName);

//     return next.handle().pipe(
//       tap(async (result) => {
//         try {
//           // Convert TTL to milliseconds for cache-manager-redis-yet
//           const ttlMs = ttl * 1000;
//           await this.cacheManager.set(cacheKey, result, ttlMs);
//           console.log(`Cache SET: ${cacheKey} (TTL: ${ttl}s)`);
//         } catch (error) {
//           console.error('Cache set error:', error);
//         }
//       }),
//     );
//   }

//   private generateCacheKey(fieldName: string, args: any, gqlContext: any): string {
//     // Include user context if available
//     const context = gqlContext.getContext();
//     // Look for user in HTTP request (queries/mutations) or WebSocket context (subscriptions)
//     const user = context.req?.user || context.connection?.context?.user || context.user;
//     const userId = user?.userId || 'anonymous';
    
//     // Create a deterministic key from arguments
//     const argsHash = Object.keys(args).length > 0 
//       ? Buffer.from(JSON.stringify(args)).toString('base64') 
//       : 'no-args';
    
//     return `gql:${fieldName}:${userId}:${argsHash}`;
//   }

//   private getDefaultTtl(fieldName: string): number {
//     // A single, sensible default. Can be overridden with @CacheTTL() decorator.
//     return 300; // 5 minutes
//   }

//   private async invalidateRelatedCaches(
//     context: ExecutionContext, 
//     mutationName: string, 
//     args: any, 
//     gqlContext: any
//   ): Promise<void> {
//     try {
//       // Get invalidation patterns from the //@CacheInvalidate decorator
//       const patternsToInvalidate = this.reflector.get<string[]>(
//         CACHE_INVALIDATE_KEY,
//         context.getHandler(),
//       );

//       if (patternsToInvalidate && patternsToInvalidate.length > 0) {
//         // Get userId from context or args
//         const context = gqlContext.getContext();
//         const user = context.req?.user || context.connection?.context?.user || context.user;
//         const userId =
//           user?.userId || args.userId || args.input?.userId || args.id || 'anonymous';
        
//         console.log(`Invalidating cache for patterns: ${patternsToInvalidate.join(', ')} for user: ${userId}`);
        
//         for (const pattern of patternsToInvalidate) {
//           // Invalidate all cache keys matching the pattern
//           await this.invalidatePattern(`gql:${pattern}:${userId}:*`);
//         }

//         // Also support invalidating patterns for all users (use with caution)
//         const globalPatterns = patternsToInvalidate.filter(p => p.startsWith('*'));
//         for (const globalPattern of globalPatterns) {
//           const cleanPattern = globalPattern.substring(1); // Remove the * prefix
//           await this.invalidatePattern(`gql:${cleanPattern}:*`);
//         }
//       }
//     } catch (error) {
//       console.error('Cache invalidation error:', error);
//     }
//   }

// private async invalidatePattern(pattern: string): Promise<void> {
//   try {
//     if (!this.redisClient || this.redisClient.status !== 'ready') {
//       console.warn('Redis client not available or not ready — skipping pattern invalidation');
//       return;
//     }

//     let cursor = '0';
//     const matchingKeys: string[] = [];
//     do {
//       const [nextCursor, keys] = await this.redisClient.scan(cursor, 'MATCH', pattern, 'COUNT', 100);
//       cursor = nextCursor;
//       if (keys && keys.length) matchingKeys.push(...keys);
//     } while (cursor !== '0');

//     if (matchingKeys.length) {
//       // split into chunks if many keys
//       const CHUNK = 1000;
//       for (let i = 0; i < matchingKeys.length; i += CHUNK) {
//         const chunk = matchingKeys.slice(i, i + CHUNK);
//         await this.redisClient.del(...chunk);
//       }
//       console.log(`Cache INVALIDATED: ${matchingKeys.length} keys for pattern "${pattern}"`);
//     } else {
//       console.log(`Cache INVALIDATED: no keys for pattern "${pattern}"`);
//     }
//   } catch (err) {
//     console.error('Error invalidating pattern:', err && err.message ? err.message : err);
//   }
// }


//   private matchesPattern(key: string, pattern: string): boolean {
//     // Convert Redis-style pattern to regex
//     const regexPattern = pattern
//       .replace(/\*/g, '.*')
//       .replace(/\?/g, '.');
    
//     const regex = new RegExp(`^${regexPattern}$`);
//     return regex.test(key);
//   }
// }