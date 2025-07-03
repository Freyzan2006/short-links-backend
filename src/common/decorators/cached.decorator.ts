// src/common/decorators/cached.decorator.ts
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

export function Cached(ttl?: number) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const cacheManager: Cache = this.cacheManager;
      if (!cacheManager) {
        throw new Error('CacheManager is not injected');
      }

      const cacheKey = `${propertyKey}_${JSON.stringify(args)}`;
      try {
        const cachedResult = await cacheManager.get(cacheKey);
        console.log(`Cache get result for ${cacheKey}:`, cachedResult);
        if (cachedResult !== undefined) {
          console.log(`Cache hit for key: ${cacheKey}`);
          return cachedResult;
        }

        const result = await originalMethod.apply(this, args);
        console.log(`Setting cache for ${cacheKey}:`, result);
        await cacheManager.set(cacheKey, result, ttl || 600);
        console.log(`Cache set for key: ${cacheKey}`);
        return result;
      } catch (error) {
        console.error(`Cache error for ${cacheKey}:`, error);
        throw error;
      }
    };
  };
}