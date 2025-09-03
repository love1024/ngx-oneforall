import { CacheService } from './cache.service';
import { StorageEngine } from '../storage/storage-engine';

class MockStorageEngine extends StorageEngine {
  private store: Record<string, string> = {};

  has(key: string): boolean {
    return key in this.store;
  }

  remove(key: string): void {
    delete this.store[key];
  }

  clear(): void {
    this.store = {};
  }

  protected getItem(key: string): string | undefined {
    return this.store[key];
  }

  protected setItem(key: string, value: string): void {
    this.store[key] = value;
  }
}

describe('CacheService', () => {
  describe('With given TTL', () => {
    let cache: CacheService;
    let storage: MockStorageEngine;

    beforeEach(() => {
      storage = new MockStorageEngine();
      cache = new CacheService(storage, 1000); // 1s TTL for testing
    });

    it('should set and get a value', () => {
      cache.set('foo', 123);
      expect(cache.get('foo')).toBe(123);
    });

    it('should return null for missing key', () => {
      expect(cache.get('missing')).toBeNull();
    });

    it('should remove a key', () => {
      cache.set('foo', 'bar');
      cache.remove('foo');
      expect(cache.get('foo')).toBeNull();
    });

    it('should clear all keys', () => {
      cache.set('a', 1);
      cache.set('b', 2);
      cache.clear();
      expect(cache.get('a')).toBeNull();
      expect(cache.get('b')).toBeNull();
    });

    it('should return true for has() if key exists and not expired', () => {
      cache.set('foo', 'bar');
      expect(cache.has('foo')).toBe(true);
    });

    it('should return false for has() if key does not exist', () => {
      expect(cache.has('missing')).toBe(false);
    });

    it('should return false for has() if key is expired', () => {
      cache.set('foo', 'bar', -1000); // Expired TTL
      expect(cache.has('foo')).toBe(false);
    });

    it('should return null for get() if key is expired', () => {
      cache.set('foo', 'bar', -1000); // Expired TTL
      expect(cache.get('foo')).toBeNull();
    });

    it('should handle invalid JSON gracefully', () => {
      storage.set('bad', 'not-json');
      expect(cache.get('bad')).toBeNull();
      expect(cache.has('bad')).toBe(false);
    });

    it('should use custom TTL if provided', () => {
      cache.set('foo', 'bar', 5000);
      const entry = JSON.parse(storage.get('foo')!);
      expect(entry.expiry).toBeGreaterThan(Date.now());
    });

    it('should store value with no expiry if ttlGlobal is falsy', () => {
      cache = new CacheService(storage, 0);
      cache.set('foo', 'bar');
      const entry = JSON.parse(storage.get('foo')!);
      expect(entry.expiry).toBeNull();
    });
  });

  describe('With default TTL', () => {
    let cache: CacheService;
    let storage: MockStorageEngine;

    beforeEach(() => {
      storage = new MockStorageEngine();
      cache = new CacheService(storage);
    });

    it('should return null for get() if key is expired', () => {
      cache.set('foo', 'bar', -3_600_000); // Expired TTL
      expect(cache.get('foo')).toBeNull();
    });
  });
});
