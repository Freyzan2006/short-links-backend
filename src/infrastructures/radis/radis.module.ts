// redis.module.ts
import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { redisStore } from 'cache-manager-redis-store';
import type { RedisClientOptions } from 'redis';

@Module({
  imports: [
    CacheModule.registerAsync<RedisClientOptions>({
      useFactory: async () => ({
        store: await redisStore({
          socket: {
            host: 'localhost', // или 'redis' если в docker-compose
            port: 6379,
          },
          ttl: 60,
        }),
      }),
    }),
  ],
  exports: [CacheModule],
})
export class RedisCacheModule {}
