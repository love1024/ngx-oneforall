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
      cache = new CacheService(storage, 1000, 'v1'); // 1s TTL for testing
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

    it('should return true for has() if key exists and not expired', () => {
      cache.set('foo', 'bar');
      expect(cache.has('foo')).toBe(true);
    });

    it('should return false for has() if key does not exist', () => {
      expect(cache.has('missing')).toBe(false);
    });

    it('should return false for has() if key is expired', () => {
      const now = Date.now();
      const key = '[cache]:foo';
      storage.set(
        key,
        JSON.stringify({ value: 'bar', expiry: now - 1000, version: 'v1' })
      );
      expect(cache.has('foo')).toBe(false);
      expect(storage.get(key)).toBeUndefined();
    });

    it('should return false for has() if version is mismatched', () => {
      const now = Date.now();
      const key = '[cache]:foo';
      storage.set(
        key,
        JSON.stringify({ value: 'bar', expiry: now + 1000, version: 'v2' })
      );
      expect(cache.has('foo')).toBe(false);
      expect(storage.get(key)).toBeUndefined();
    });

    it('should return null for get() if key is expired', () => {
      const now = Date.now();
      const key = '[cache]:foo';
      storage.set(
        key,
        JSON.stringify({ value: 'bar', expiry: now - 1000, version: 'v1' })
      );
      expect(cache.get('foo')).toBeNull();
      expect(storage.get(key)).toBeUndefined();
    });

    it('should handle invalid JSON gracefully', () => {
      const key = '[cache]:bad';
      storage.set(key, 'not-json');
      expect(cache.get('bad')).toBeNull();
      expect(cache.has('bad')).toBe(false);
    });

    it('should use custom TTL if provided', () => {
      cache.set('foo', 'bar', { ttl: 5000 });
      const entry = JSON.parse(storage.get('[cache]:foo')!);
      expect(entry.expiry).toBeGreaterThan(Date.now());
    });

    it('should store value with no expiry if ttlGlobal is falsy', () => {
      cache = new CacheService(storage, 0, 'v1');
      cache.set('foo', 'bar');
      const entry = JSON.parse(storage.get('[cache]:foo')!);
      expect(entry.expiry).toBeNull();
    });

    it('should remove key if version does not match (verifyVersion)', () => {
      const key = '[cache]:foo';
      storage.set(
        key,
        JSON.stringify({ value: 'bar', expiry: null, version: 'old-version' })
      );
      expect(cache.get('foo')).toBeNull();
      expect(storage.get(key)).toBeUndefined();
    });

    it('should not remove key if version matches (verifyVersion)', () => {
      const key = '[cache]:foo';
      storage.set(
        key,
        JSON.stringify({ value: 'bar', expiry: null, version: 'v1' })
      );
      expect(cache.get('foo')).toBe('bar');
      expect(storage.get(key)).toBeDefined();
    });

    it('should do nothing in verifyVersion if no version is set', () => {
      cache = new CacheService(storage, 1000);
      const key = '[cache]:foo';
      storage.set(
        key,
        JSON.stringify({ value: 'bar', expiry: null, version: 'any' })
      );
      expect(cache.get('foo')).toBe('bar');
      expect(storage.get(key)).toBeDefined();
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
      cache.set('foo', 'bar', { ttl: -3_600_000 }); // Expired TTL
      expect(cache.get('foo')).toBeNull();
    });
  });
});
