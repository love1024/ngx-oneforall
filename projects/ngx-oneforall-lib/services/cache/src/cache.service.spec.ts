import { CacheService } from './cache.service';
import { StorageEngine } from '@ngx-oneforall/services/storage';

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

  length(): number {
    return Object.keys(this.store).length;
  }

  key(index: number): string | null {
    const keys = Object.keys(this.store);
    return keys[index] ?? null;
  }

  protected getItem(key: string): string | undefined {
    return this.store[key];
  }

  protected setItem(key: string, value: string): void {
    this.store[key] = value;
  }

  keys(): string[] {
    return Object.keys(this.store);
  }
}

describe('CacheService', () => {
  describe('with custom ttl', () => {
    let cache: CacheService;
    let storage: MockStorageEngine;
    let getStorageEngineMock: jest.Mock;

    beforeEach(() => {
      storage = new MockStorageEngine();
      getStorageEngineMock = jest.fn().mockReturnValue(storage);
      cache = new CacheService(storage, getStorageEngineMock, 1000, 'v1');
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
      cache = new CacheService(storage, getStorageEngineMock, 0, 'v1');
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

    it('should set a internal version if no version is set', () => {
      cache = new CacheService(storage, getStorageEngineMock, 1000);
      const key = '[cache]:foo';
      storage.set(
        key,
        JSON.stringify({ value: 'bar', expiry: null, version: 'any' })
      );
      expect(cache.get('foo')).toBe(null);
      expect(storage.get(key)).toBeUndefined();
    });

    it('should clear all cache keys using keys() if available', () => {
      storage.set('[cache]:foo', '1');
      storage.set('[cache]:bar', '2');
      storage.set('other', 'not cache');
      const removeSpy = jest.spyOn(storage, 'remove');
      cache.clear();
      expect(removeSpy).toHaveBeenCalledWith('[cache]:foo');
      expect(removeSpy).toHaveBeenCalledWith('[cache]:bar');
      expect(removeSpy).not.toHaveBeenCalledWith('other');
    });

    // it('should clear all cache keys using key()/length() if keys() is not available', () => {
    //   // Remove keys() to force fallback
    //   delete storage.keys;
    //   storage.set('[cache]:foo', '1');
    //   storage.set('[cache]:bar', '2');
    //   storage.set('other', 'not cache');
    //   const removeSpy = jest.spyOn(storage, 'remove');
    //   cache.clear();
    //   expect(removeSpy).toHaveBeenCalledWith('[cache]:foo');
    //   expect(removeSpy).toHaveBeenCalledWith('[cache]:bar');
    //   expect(removeSpy).not.toHaveBeenCalledWith('other');
    // });

    it('should do nothing if there are no cache keys', () => {
      const removeSpy = jest.spyOn(storage, 'remove');
      cache.clear();
      expect(removeSpy).not.toHaveBeenCalled();
    });

    it('should use getStorageEngine for set() when config.storage is provided', () => {
      cache.set('foo', 'bar', { storage: 'memory' });
      expect(getStorageEngineMock).toHaveBeenCalledWith('memory');
    });

    it('should use getStorageEngine for get() when storageEngine is provided', () => {
      cache.get('foo', 'memory');
      expect(getStorageEngineMock).toHaveBeenCalledWith('memory');
    });

    it('should use getStorageEngine for has() when storageEngine is provided', () => {
      cache.has('foo', 'memory');
      expect(getStorageEngineMock).toHaveBeenCalledWith('memory');
    });

    it('should use getStorageEngine for remove() when storageEngine is provided', () => {
      cache.remove('foo', 'memory');
      expect(getStorageEngineMock).toHaveBeenCalledWith('memory');
    });

    it('should use getStorageEngine for clear() when storageEngine is provided', () => {
      cache.clear('memory');
      expect(getStorageEngineMock).toHaveBeenCalledWith('memory');
    });

    it('should clear all storages if no storageEngine is given', () => {
      const local = new MockStorageEngine();
      const session = new MockStorageEngine();
      const memory = new MockStorageEngine();
      const getStorageEngineMulti = jest
        .fn()
        .mockImplementation((type: string) => {
          if (type === 'local') return local;
          if (type === 'session') return session;
          if (type === 'memory') return memory;
          return storage;
        });
      cache = new CacheService(storage, getStorageEngineMulti, 1000, 'v1');
      local.set('[cache]:foo', '1');
      session.set('[cache]:bar', '2');
      memory.set('[cache]:baz', '3');
      storage.set('[cache]:qux', '4');
      const removeSpyLocal = jest.spyOn(local, 'remove');
      const removeSpySession = jest.spyOn(session, 'remove');
      const removeSpyMemory = jest.spyOn(memory, 'remove');
      const removeSpyStorage = jest.spyOn(storage, 'remove');
      cache.clear();
      expect(removeSpyLocal).toHaveBeenCalledWith('[cache]:foo');
      expect(removeSpySession).toHaveBeenCalledWith('[cache]:bar');
      expect(removeSpyMemory).toHaveBeenCalledWith('[cache]:baz');
      expect(removeSpyStorage).toHaveBeenCalledWith('[cache]:qux');
    });

    // it('should return null for get() if key is expired with default TTL', () => {
    //   cache = new CacheService(storage);
    //   cache.set('foo', 'bar', { ttl: -3_600_000 }); // Expired TTL
    //   expect(cache.get('foo')).toBeNull();
    // });
  });

  describe('with default ttl', () => {
    let cache: CacheService;
    let storage: MockStorageEngine;
    let getStorageEngineMock: jest.Mock;

    beforeEach(() => {
      storage = new MockStorageEngine();
      getStorageEngineMock = jest.fn().mockReturnValue(storage);
      cache = new CacheService(storage, getStorageEngineMock);
    });

    it('should return null for get() if key is expired', () => {
      const now = Date.now();
      const key = '[cache]:foo';
      storage.set(
        key,
        JSON.stringify({ value: 'bar', expiry: now - 3_600_001 })
      );
      expect(cache.get('foo')).toBeNull();
      expect(storage.get(key)).toBeUndefined();
    });
  });
});
