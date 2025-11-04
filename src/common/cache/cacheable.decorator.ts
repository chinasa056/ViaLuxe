// import { SetMetadata } from '@nestjs/common';
// import {
//   CACHE_DISABLED_KEY,
//   CACHE_TTL_KEY,
//   CACHE_INVALIDATE_KEY,
// } from './service-cache.interceptor';

// // Disable caching for specific resolvers
// export const CacheDisabled = () => SetMetadata(CACHE_DISABLED_KEY, true);

// // Set custom TTL for specific resolvers
// export const CacheTTL = (ttl: number) => SetMetadata(CACHE_TTL_KEY, ttl);

// /**
//  * Specifies which queries to invalidate when this mutation is executed.
//  * @param queries An array of query names (as strings) to invalidate.
//  */
// export const CacheInvalidate = (queries: string[]) =>
//   SetMetadata(CACHE_INVALIDATE_KEY, queries);

// // Convenience decorators
// export const CacheForever = () => CacheTTL(86400 * 7); // 7 days
// export const CacheShort = () => CacheTTL(60); // 1 minute
// export const CacheMedium = () => CacheTTL(600); // 10 minutes
// export const CacheLong = () => CacheTTL(3600); // 1 hour