import { InjectionToken, Provider } from '@angular/core';
import { CacheService as InternalCacheService } from './cache.service';
import { StorageEngine } from '../storage/storage-engine';
import { WebStorageService } from '../storage/storages/web-storage.service';
import { MemoryStorageService } from '../storage/storages/memory-storage.service';

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

export function getStorageEngine(storage?: string, prefix?: string) {
  let storageEngine: StorageEngine;
  if (storage === 'local') {
    storageEngine = new WebStorageService(localStorage, prefix);
  } else if (storage === 'session') {
    storageEngine = new WebStorageService(sessionStorage, prefix);
  } else {
    storageEngine = new MemoryStorageService();
  }

  return storageEngine;
}

export function provideCacheService(options?: CacheOptions): Provider {
  return {
    provide: CacheService,
    useFactory: () => {
      const storageEngine = getStorageEngine(
        options?.storage,
        options?.storagePrefix
      );
      return new InternalCacheService(
        storageEngine,
        options?.ttl,
        options?.version
      );
    },
  };
}
