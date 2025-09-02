import { StorageEngine } from '../storage/storage-engine';

interface CacheEntry<T> {
  value: T;
  expiry: number | null;
}

export class CacheService {
  constructor(
    private readonly storage: StorageEngine,
    private readonly ttlGlobal = 3_600_000 // 1 hour,
  ) {}

  /**
   * Set a value in the cache.
   * @param key Cache key
   * @param value Value to cache
   * @param ttl Time-to-live in ms (optional, default: no expiry)
   */
  set<T>(key: string, value: T, ttl?: number): void {
    const ttlTime = ttl || this.ttlGlobal;
    const expiry = ttlTime ? Date.now() + ttlTime : null;
    this.storage.set(key, JSON.stringify({ value, expiry }));
  }

  get<T>(key: string): T | null {
    const entry = this.storage.get(key);
    if (!entry) return null;

    try {
      const parsed = JSON.parse(entry) as CacheEntry<T>;
      if (parsed?.expiry && Date.now() > parsed.expiry) {
        this.storage.remove(key);
        return null;
      }

      return parsed.value;
    } catch {
      return null;
    }
  }

  has(key: string): boolean {
    const entry = this.storage.get(key);
    if (!entry) return false;

    try {
      const parsed = JSON.parse(entry) as CacheEntry<unknown>;
      if (parsed.expiry && Date.now() > parsed.expiry) {
        this.storage.remove(key);
        return false;
      }

      return true;
    } catch {
      return false;
    }
  }

  remove(key: string): void {
    this.storage.remove(key);
  }

  clear(): void {
    this.storage.clear();
  }
}
