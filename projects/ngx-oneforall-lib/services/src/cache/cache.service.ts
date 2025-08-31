import { Injectable } from '@angular/core';

interface CacheEntry<T> {
  value: T;
  expiry: number | null;
}

@Injectable()
export class CacheService {
  private cache = new Map<string, CacheEntry<unknown>>();

  /**
   * Set a value in the cache.
   * @param key Cache key
   * @param value Value to cache
   * @param ttl Time-to-live in ms (optional, default: no expiry)
   */
  set<T>(key: string, value: T, ttl?: number): void {
    const expiry = ttl ? Date.now() + ttl : null;

    this.cache.set(key, { value, expiry });
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key) as CacheEntry<T> | undefined;
    if (!entry) return null;

    if (entry?.expiry && Date.now() > entry.expiry) {
      this.cache.delete(key);
      return null;
    }

    return entry.value;
  }

  has(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;

    if (entry.expiry && Date.now() > entry.expiry) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }
}
