// // src/common/redis/redis.provider.ts
// import { Logger, Provider } from '@nestjs/common';
// import Redis from 'ioredis';

// export const RedisProvider: Provider = {
//   provide: 'REDIS_CLIENT',
//   useFactory: () => {
//     const logger = new Logger('RedisProvider');
//     const host = process.env.REDIS_HOST || '127.0.0.1';
//     const port = Number(process.env.REDIS_PORT || 6379);
//     const password = process.env.REDIS_PASSWORD || undefined;
//     const username = process.env.REDIS_USERNAME && process.env.REDIS_USERNAME !== 'default'
//       ? process.env.REDIS_USERNAME
//       : undefined;
//     const tlsEnabled = !!process.env.REDIS_TLS;

//     const client = new Redis({
//       host,
//       port,
//       username,
//       password,
//       lazyConnect: true,
//       enableOfflineQueue: false,
//       maxRetriesPerRequest: 3, // Don't let commands hang forever
//       retryStrategy(times) {
//         const delay = Math.min(times * 50, 2000); // exponential backoff
//         logger.warn(`Redis connection lost. Retrying in ${delay}ms... (Attempt ${times})`);
//         return delay;
//       },
//       tls: tlsEnabled ? {} : undefined,
//     });

//     client.on('error', (err) => {
//       // Log Redis errors without crashing the app. ECONNRESET will be logged here.
//       logger.error(`Redis client error: ${err.message}`, err.stack);
//     });

//     client.on('connect', () => {
//       logger.log('Connecting to Redis...');
//     });

//     client.on('ready', () => {
//       logger.log('Redis client is ready.');
//     });

//     client.connect().catch(e => logger.error('Initial Redis connection failed:', e.message || e));
//     return client;
//   },
// };
