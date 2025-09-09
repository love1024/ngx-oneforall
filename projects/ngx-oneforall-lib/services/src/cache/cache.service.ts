import { StorageEngine } from '../storage/storage-engine';
import {
  CacheOptions,
  CacheStorageType,
  getStorageEngine,
} from './cache-provider';

interface CacheEntry<T> {
  value: T;
  expiry: number | null;
  version: string;
}

type CacheConfig = Omit<CacheOptions, 'storagePrefix'>;

export class CacheService {
  private readonly prefixKey = '[cache]:';

  // Global config
  constructor(
    private readonly storage: StorageEngine,
    private readonly ttlGlobal = 3_600_000, // 1 hour,
    private readonly version?: string
  ) {}

  /**
   * Set a value in the cache.
   * @param key Cache key
   * @param value Value to cache
   * @param ttl Time-to-live in ms (optional, default: no expiry)
   */
  set<T>(key: string, value: T, config?: CacheConfig): void {
    const prefixedKey = this.getPrefixedKey(key);

    const ttlTime = config?.ttl ?? this.ttlGlobal;
    const expiry = ttlTime ? Date.now() + ttlTime : null;
    const version = config?.version || this.version;
    const storage = config?.storage
      ? getStorageEngine(config?.storage)
      : this.storage;

    storage.set(
      prefixedKey,
      JSON.stringify({ value, expiry, version: version ?? null })
    );
  }

  get<T>(key: string, storageEngine?: CacheStorageType): T | null {
    if (!this.verifyVersion(key, storageEngine)) return null;

    const storage = storageEngine
      ? getStorageEngine(storageEngine)
      : this.storage;

    const prefixedKey = this.getPrefixedKey(key);
    const entry = storage.get(prefixedKey);
    if (!entry) return null;

    try {
      const parsed = JSON.parse(entry) as CacheEntry<T>;

      if (parsed?.expiry && Date.now() > parsed.expiry) {
        storage.remove(prefixedKey);
        return null;
      }

      return parsed.value;
    } catch {
      return null;
    }
  }

  has(key: string, storageEngine?: CacheStorageType): boolean {
    if (!this.verifyVersion(key, storageEngine)) return false;

    const storage = storageEngine
      ? getStorageEngine(storageEngine)
      : this.storage;

    const prefixedKey = this.getPrefixedKey(key);

    const entry = storage.get(prefixedKey);
    if (!entry) return false;

    try {
      const parsed = JSON.parse(entry) as CacheEntry<unknown>;
      if (parsed.expiry && Date.now() > parsed.expiry) {
        storage.remove(prefixedKey);
        return false;
      }

      return true;
    } catch {
      return false;
    }
  }

  remove(key: string, storageEngine?: CacheStorageType): void {
    const storage = storageEngine
      ? getStorageEngine(storageEngine)
      : this.storage;

    const prefixedKey = this.getPrefixedKey(key);

    storage.remove(prefixedKey);
  }

  clear(storageEngine?: CacheStorageType) {
    const storage = storageEngine
      ? getStorageEngine(storageEngine)
      : this.storage;

    const keysToRemove: string[] = [];

    for (let i = 0; i < storage.length(); i++) {
      const key = storage.key(i);
      if (key && key.startsWith(this.prefixKey)) {
        keysToRemove.push(key);
      }
    }

    keysToRemove.forEach(key => storage.remove(key));
  }

  private verifyVersion(key: string, storageEngine?: CacheStorageType) {
    if (!this.version) return true;

    const storage = storageEngine
      ? getStorageEngine(storageEngine)
      : this.storage;

    const prefixedKey = this.getPrefixedKey(key);
    const cached = storage.get(prefixedKey);
    if (!cached) return true;

    try {
      const parsed = JSON.parse(cached) as CacheEntry<unknown>;

      if (parsed.version !== this.version) {
        storage.remove(prefixedKey);
        return false;
      }
    } catch {
      return true;
    }
    return true;
  }

  private getPrefixedKey(key: string) {
    return `${this.prefixKey}${key}`;
  }
}
