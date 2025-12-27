import {
  StorageEngine,
  MemoryStorageService,
  WebStorageService,
} from '@ngx-oneforall/services/storage';
import { CacheStorageType } from './cache-provider';

// Storage cache to keep track of all storage created so far, and use the same
const storageCache = new Map<string, StorageEngine>();

function getStorageKey(storage: CacheStorageType, prefix?: string): string {
  return storage.toString() + (prefix ?? '');
}

export function getStorageEngine(
  storage: CacheStorageType = 'memory',
  prefix?: string
) {
  const key = getStorageKey(storage, prefix);
  if (storageCache.has(key)) {
    return storageCache.get(key)!;
  }

  let storageEngine: StorageEngine;
  if (storage === 'local') {
    storageEngine = new WebStorageService(localStorage, prefix);
  } else if (storage === 'session') {
    storageEngine = new WebStorageService(sessionStorage, prefix);
  } else {
    storageEngine = new MemoryStorageService();
  }
  storageCache.set(key, storageEngine);

  return storageEngine;
}
