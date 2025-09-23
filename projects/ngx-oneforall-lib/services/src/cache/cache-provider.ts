import {
  EnvironmentProviders,
  InjectionToken,
  makeEnvironmentProviders,
} from '@angular/core';
import { CacheService as InternalCacheService } from './cache.service';
import { getStorageEngine } from './cache.util';

export interface CacheOptions {
  storage?: CacheStorageType;
  ttl?: number;
  storagePrefix?: string;
  version?: string;
}

export type CacheStorageType = 'memory' | 'local' | 'session';

export const CacheService = new InjectionToken<InternalCacheService>(
  'CACHE_SERVICE'
);

export function provideCacheService(
  options?: CacheOptions
): EnvironmentProviders {
  return makeEnvironmentProviders([
    {
      provide: CacheService,
      useFactory: () => {
        const storageEngine = getStorageEngine(
          options?.storage,
          options?.storagePrefix
        );
        return new InternalCacheService(
          storageEngine,
          getStorageEngine,
          options?.ttl,
          options?.version
        );
      },
    },
  ]);
}
