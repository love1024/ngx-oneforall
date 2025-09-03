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

    it('should clear storage and set version if stored version is different', () => {
      const storage = new MockStorageEngine();
      storage.set('__NGX_ONEFORALL_CACHE_VERSION__', 'old-version');
      const clearSpy = jest.spyOn(storage, 'clear');
      const setSpy = jest.spyOn(storage, 'set');

      // Instantiating CacheService with a new version triggers verifyVersion
      new CacheService(storage, 1000, 'new-version');

      expect(clearSpy).toHaveBeenCalled();
      expect(setSpy).toHaveBeenCalledWith(
        '__NGX_ONEFORALL_CACHE_VERSION__',
        'new-version'
      );
    });

    it('should not clear storage if stored version matches', () => {
      const storage = new MockStorageEngine();
      storage.set('__NGX_ONEFORALL_CACHE_VERSION__', 'same-version');
      const clearSpy = jest.spyOn(storage, 'clear');
      const setSpy = jest.spyOn(storage, 'set');

      new CacheService(storage, 1000, 'same-version');

      expect(clearSpy).not.toHaveBeenCalled();
      // Should not set version again if already matches
      expect(setSpy).not.toHaveBeenCalledWith(
        '__NGX_ONEFORALL_CACHE_VERSION__',
        'same-version'
      );
    });

    it('should do nothing if version is not provided', () => {
      const storage = new MockStorageEngine();
      const clearSpy = jest.spyOn(storage, 'clear');
      const setSpy = jest.spyOn(storage, 'set');

      new CacheService(storage, 1000);

      expect(clearSpy).not.toHaveBeenCalled();
      expect(setSpy).not.toHaveBeenCalled();
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
