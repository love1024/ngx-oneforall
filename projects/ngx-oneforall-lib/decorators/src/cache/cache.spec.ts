// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mockStorage: any = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _store: {} as Record<string, any>,
  get: jest.fn((key: string) => mockStorage._store[key]),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  set: jest.fn((key: string, value: any) => {
    mockStorage._store[key] = value;
  }),
};

jest.mock('../../../services/cache/src/cache.util', () => ({
  getStorageEngine: () => mockStorage,
}));

import { Cache, DEFAULT_CACHE_KEY_SELECTOR } from './cache';
import { Observable, of, delay } from 'rxjs';

describe('Cache Decorator (with mock component)', () => {
  let now = Date.now();

  beforeEach(() => {
    now = Date.now();
    jest.spyOn(Date, 'now').mockImplementation(() => now);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  class MockComponent {
    callCount = 0;

    @Cache()
    getValue(a: number, b: number): Observable<number> {
      this.callCount++;
      return of(a + b);
    }

    @Cache({ ttl: 1000 })
    getWithTTL(a: number): Observable<number> {
      this.callCount++;
      return of(a * 2);
    }

    @Cache({ maxItems: 2 })
    getLimited(a: number): Observable<number> {
      this.callCount++;
      return of(a);
    }

    @Cache({ cacheKeySelector: params => [params[0]] })
    getCustomHashed(a: number): Observable<number> {
      this.callCount++;
      return of(a).pipe(delay(100));
    }

    @Cache({
      cacheKeyMatcher: (a, b) => (a as number[])[0] === (b as number[])[0],
    })
    getCustomMatcher(a: number): Observable<number> {
      this.callCount++;
      return of(a);
    }
  }

  it('should cache and return the same observable for same params', () => {
    const comp = new MockComponent();
    const obs1 = comp.getValue(1, 2);
    const obs2 = comp.getValue(1, 2);
    expect(obs1).toBe(obs2);
    expect(comp.callCount).toBe(1);
  });

  it('should call original method for different params', () => {
    const comp = new MockComponent();
    comp.getValue(4, 5);
    comp.getValue(6, 7);
    expect(comp.callCount).toBe(2);
  });

  it('should expire cache after ttl', () => {
    const comp = new MockComponent();
    comp.getWithTTL(5).subscribe();
    expect(comp.callCount).toBe(1);

    // Simulate time passing
    now += 2000;
    jest.spyOn(Date, 'now').mockImplementation(() => now);

    comp.getWithTTL(5).subscribe();
    expect(comp.callCount).toBe(2);
  });

  it('should enforce maxItems in cache', () => {
    const comp = new MockComponent();
    comp.getLimited(1).subscribe();
    comp.getLimited(2).subscribe();
    comp.getLimited(3).subscribe();

    // Only last 2 should be cached
    expect(mockStorage.set).toHaveBeenCalled();
    const lastCache = mockStorage._store['CACHE_DECORATOR'];
    const data = lastCache.data as Record<string, unknown[]>;
    expect(Object.values(data)[0].length).toBeLessThanOrEqual(2);
  });

  it('should use custom cacheKeySelector', () => {
    const comp = new MockComponent();
    const obs1 = comp.getCustomHashed(1);
    const obs2 = comp.getCustomHashed(1);
    expect(obs1).toBe(obs2);
    expect(comp.callCount).toBe(1);
  });

  it('should use custom cacheKeyMatcher', () => {
    const comp = new MockComponent();
    const obs1 = comp.getCustomMatcher(1);
    const obs2 = comp.getCustomMatcher(1);
    expect(obs1).toBe(obs2);
    expect(comp.callCount).toBe(1);
  });

  it('should reset cache if version changes', () => {
    const comp = new MockComponent();
    comp.getValue(1, 2).subscribe();
    // Simulate version change
    const oldMeta = mockStorage._store['CACHE_DECORATOR'].__meta__;
    mockStorage._store['CACHE_DECORATOR'].__meta__ = {
      ...oldMeta,
      version: 'old',
    };
    comp.getValue(1, 2).subscribe();
    expect(mockStorage.set).toHaveBeenCalled();
  });

  it('should handle pending requests and share observable', done => {
    class AsyncComponent {
      callCount = 0;
      @Cache()
      getAsync(val: number): Observable<number> {
        this.callCount++;
        return of(val).pipe(delay(10));
      }
    }
    const comp = new AsyncComponent();
    const obs1 = comp.getAsync(1);
    const obs2 = comp.getAsync(1);

    expect(obs1).toBe(obs2);

    obs1.subscribe(val => {
      expect(val).toBe(1);
      expect(comp.callCount).toBe(1);
      done();
    });
  });

  it('should not cache if original method is missing', () => {
    const desc: PropertyDescriptor = {};
    const decorator = Cache();
    expect(() => decorator({}, 'missing', desc)).not.toThrow();
  });

  it('should call enforceMaxItems and trim cache when maxItems is exceeded', () => {
    mockStorage._store['CACHE_DECORATOR'] = {
      data: {
        'MockComponent-getLimited': [
          {
            parameters: [3],
            response: 3,
          },
          {
            parameters: [3],
            response: 3,
          },
          {
            parameters: [3],
            response: 3,
          },
          {
            parameters: [3],
            response: 3,
          },
        ],
      },
    };
    const comp = new MockComponent();

    // Fill cache with maxItems (2) + 1
    comp.getLimited(100).subscribe();
    comp.getLimited(200).subscribe();
    comp.getLimited(300).subscribe();

    // The cache should only keep the last 2 items
    const lastCache = mockStorage._store['CACHE_DECORATOR'];
    const data = lastCache.data as Record<string, unknown[]>;
    const cachedItems = Object.values(data)[Object.values(data).length - 1];
    expect(cachedItems.length).toBe(2);
    expect(cachedItems).toEqual(
      expect.not.arrayContaining([expect.objectContaining({ parameters: [1] })])
    );
  });

  it("should use 'ROOT' as cacheKey if target.constructor.name is not available", () => {
    // Create a dummy target without a constructor name
    const dummyTarget = Object.create(null);
    const desc: PropertyDescriptor = {
      value: jest.fn(() => of(42)),
    };

    // Patch getStorageEngine to return our mockStorage
    const decorator = Cache();
    decorator(dummyTarget, 'someMethod', desc);

    // Call the decorated method
    desc.value(1, 2).subscribe((result: number) => {
      expect(result).toBe(42);
    });

    // The cacheKey should be 'ROOT-someMethod'
    // So the storage should have a data property with that key
    const lastCache = mockStorage._store['CACHE_DECORATOR'];
    expect(Object.keys(lastCache.data)).toContain('ROOT-someMethod');
  });

  it('should use param directly in DEFAULT_CACHE_KEY_SELECTOR if param is undefined', () => {
    const params = [1, undefined, 'test'];
    const result = DEFAULT_CACHE_KEY_SELECTOR(params);
    expect(result).toEqual([1, undefined, 'test']);
  });
});
