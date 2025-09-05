import { StorageEngine } from '../storage/storage-engine';
import { CacheOptions } from './cache-provider';

interface CacheEntry<T> {
  value: T;
  expiry: number | null;
  version: string;
}

type CacheConfig = Pick<CacheOptions, 'ttl' | 'version'>;

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

    this.storage.set(
      prefixedKey,
      JSON.stringify({ value, expiry, version: version ?? null })
    );
  }

  get<T>(key: string): T | null {
    if (!this.verifyVersion(key)) return null;

    const prefixedKey = this.getPrefixedKey(key);
    const entry = this.storage.get(prefixedKey);
    if (!entry) return null;

    try {
      const parsed = JSON.parse(entry) as CacheEntry<T>;

      if (parsed?.expiry && Date.now() > parsed.expiry) {
        this.storage.remove(prefixedKey);
        return null;
      }

      return parsed.value;
    } catch {
      return null;
    }
  }

  has(key: string): boolean {
    if (!this.verifyVersion(key)) return false;

    const prefixedKey = this.getPrefixedKey(key);

    const entry = this.storage.get(prefixedKey);
    if (!entry) return false;

    try {
      const parsed = JSON.parse(entry) as CacheEntry<unknown>;
      if (parsed.expiry && Date.now() > parsed.expiry) {
        this.storage.remove(prefixedKey);
        return false;
      }

      return true;
    } catch {
      return false;
    }
  }

  remove(key: string): void {
    const prefixedKey = this.getPrefixedKey(key);

    this.storage.remove(prefixedKey);
  }

  clear() {
    const keysToRemove: string[] = [];

    for (let i = 0; i < this.storage.length(); i++) {
      const key = this.storage.key(i);
      if (key && key.startsWith(this.prefixKey)) {
        keysToRemove.push(key);
      }
    }

    keysToRemove.forEach(key => this.storage.remove(key));
  }

  private verifyVersion(key: string) {
    if (!this.version) return true;

    const prefixedKey = this.getPrefixedKey(key);
    const cached = this.storage.get(prefixedKey);
    if (!cached) return true;

    try {
      const parsed = JSON.parse(cached) as CacheEntry<unknown>;

      if (parsed.version !== this.version) {
        this.storage.remove(prefixedKey);
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
