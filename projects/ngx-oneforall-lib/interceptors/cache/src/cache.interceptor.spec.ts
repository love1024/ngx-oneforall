import { TestBed } from '@angular/core/testing';
import {
  HttpClient,
  HttpRequest,
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { withCacheInterceptor } from './cache.interceptor';
import { useCache } from './cache-context';
import { PLATFORM_ID, inject } from '@angular/core';

describe('cacheInterceptor', () => {
  let httpTesting: HttpTestingController;
  let http: HttpClient;

  beforeEach(() => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(
          withInterceptors([withCacheInterceptor({ strategy: 'manual' })])
        ),
        provideHttpClientTesting(),
      ],
    });

    http = TestBed.inject(HttpClient);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should return cached response if enabled and cache has key', () => {
    // First request - should hit network
    http.get('/api/data', { context: useCache() }).subscribe();
    const req1 = httpTesting.expectOne('/api/data');
    req1.flush({ body: 'cached' });

    // Second request - should return cached
    http.get('/api/data', { context: useCache() }).subscribe(resp => {
      expect(resp).toEqual(
        expect.objectContaining({ body: { body: 'cached' } })
      );
    });

    // No second network request expected
  });

  it('should call next and cache response if enabled and cache does not have key', () => {
    http
      .get('/api/fresh-data', {
        context: useCache({ ttl: 1000, storage: 'memory' }),
      })
      .subscribe();

    const req = httpTesting.expectOne('/api/fresh-data');
    req.flush({ body: 'fresh' });
  });

  it('should use custom key from context', () => {
    // First request with custom key
    http
      .get('/api/data', { context: useCache({ key: 'custom-key' }) })
      .subscribe();
    const req1 = httpTesting.expectOne('/api/data');
    req1.flush({ body: 'cached' });

    // Second request with same custom key - should be cached
    http
      .get('/api/other', { context: useCache({ key: 'custom-key' }) })
      .subscribe(resp => {
        expect(resp).toEqual(
          expect.objectContaining({ body: { body: 'cached' } })
        );
      });

    // No network request for /api/other due to cache hit
  });

  it('should use key function from context', () => {
    const keyFn = (r: HttpRequest<unknown>) => `func-${r.method}`;

    // First request
    http.get('/api/data', { context: useCache({ key: keyFn }) }).subscribe();
    const req1 = httpTesting.expectOne('/api/data');
    req1.flush({ body: 'cached' });

    // Second request with same key function result - should be cached
    http
      .get('/api/other', { context: useCache({ key: keyFn }) })
      .subscribe(resp => {
        expect(resp).toEqual(
          expect.objectContaining({ body: { body: 'cached' } })
        );
      });

    // No network request for /api/other due to cache hit
  });

  it('should call next if context.enabled is not true', () => {
    http
      .get('/api/data', {
        context: useCache({ enabled: false }),
      })
      .subscribe();

    const req = httpTesting.expectOne('/api/data');
    req.flush({ body: 'not-cached' });

    // Second request should still hit network
    http
      .get('/api/data', { context: useCache({ enabled: false }) })
      .subscribe();
    const req2 = httpTesting.expectOne('/api/data');
    req2.flush({ body: 'not-cached' });
  });
});

describe('cacheInterceptor - auto strategy', () => {
  let httpTesting: HttpTestingController;
  let http: HttpClient;

  beforeEach(() => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(
          withInterceptors([withCacheInterceptor({ strategy: 'auto' })])
        ),
        provideHttpClientTesting(),
      ],
    });

    http = TestBed.inject(HttpClient);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should cache GET requests with JSON response', () => {
    // First request
    http.get('/api/auto-cache-data').subscribe();
    const req1 = httpTesting.expectOne('/api/auto-cache-data');
    req1.flush({ body: 'cached' });

    // Second request - should be cached (no network)
    http.get('/api/auto-cache-data').subscribe(resp => {
      expect(resp).toEqual(
        expect.objectContaining({ body: { body: 'cached' } })
      );
    });
  });

  it('should not cache POST requests', () => {
    http.post('/api/data', {}).subscribe();
    const req1 = httpTesting.expectOne('/api/data');
    req1.flush({ body: 'response' });

    // Second POST - should still hit network
    http.post('/api/data', {}).subscribe();
    const req2 = httpTesting.expectOne('/api/data');
    req2.flush({ body: 'response' });
  });
});

describe('cacheInterceptor - Platform server', () => {
  let httpTesting: HttpTestingController;
  let http: HttpClient;

  beforeEach(() => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        { provide: PLATFORM_ID, useValue: 'server' },
        provideHttpClient(withInterceptors([withCacheInterceptor()])),
        provideHttpClientTesting(),
      ],
    });

    http = TestBed.inject(HttpClient);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should not cache for platform server', () => {
    http.get('/api/data', { context: useCache({ enabled: true }) }).subscribe();
    const req1 = httpTesting.expectOne('/api/data');
    req1.flush({ body: 'not-cached' });

    // Second request should still hit network (no caching on server)
    http.get('/api/data', { context: useCache({ enabled: true }) }).subscribe();
    const req2 = httpTesting.expectOne('/api/data');
    req2.flush({ body: 'not-cached' });
  });
});

describe('cacheInterceptor - config options', () => {
  it('should use default config when called without arguments', () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([withCacheInterceptor()])),
        provideHttpClientTesting(),
      ],
    });

    const http = TestBed.inject(HttpClient);
    const httpTesting = TestBed.inject(HttpTestingController);

    // Default strategy is manual, so no cache without context
    http.get('/api/data').subscribe();
    const req = httpTesting.expectOne('/api/data');
    req.flush({ body: 'response' });

    httpTesting.verify();
  });

  it('should use custom storage option', () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(
          withInterceptors([
            withCacheInterceptor({ strategy: 'manual', storage: 'session' }),
          ])
        ),
        provideHttpClientTesting(),
      ],
    });

    const http = TestBed.inject(HttpClient);
    const httpTesting = TestBed.inject(HttpTestingController);

    http.get('/api/data', { context: useCache() }).subscribe();
    const req = httpTesting.expectOne('/api/data');
    req.flush({ body: 'cached' });

    httpTesting.verify();
  });

  it('should execute cacheBust function and clear cache if true returned', () => {
    const cacheBustSpy = jest.fn().mockReturnValue(true);

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(
          withInterceptors([
            withCacheInterceptor({
              strategy: 'manual',
              cacheBust: cacheBustSpy,
            }),
          ])
        ),
        provideHttpClientTesting(),
      ],
    });

    const http = TestBed.inject(HttpClient);
    const httpTesting = TestBed.inject(HttpTestingController);

    // Initial request to populate cache
    http.get('/api/data', { context: useCache() }).subscribe();
    const req1 = httpTesting.expectOne('/api/data');
    req1.flush({ body: 'cached' });

    // Second request with cacheBust returning true
    http.get('/api/other').subscribe();
    const req2 = httpTesting.expectOne('/api/other');
    req2.flush({ body: 'response' });

    expect(cacheBustSpy).toHaveBeenCalledWith(expect.any(HttpRequest));

    // Verify cache is cleared by making third request to supposedly cached endpoint
    http.get('/api/data', { context: useCache() }).subscribe();
    const req3 = httpTesting.expectOne('/api/data'); // Should hit network again
    req3.flush({ body: 'fresh' });

    httpTesting.verify();
  });

  it('should run cacheBust in injection context', () => {
    const cacheBustFn = jest.fn((req: HttpRequest<unknown>) => {
      // Should not throw
      const platform = inject(PLATFORM_ID);
      return false;
    });

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(
          withInterceptors([
            withCacheInterceptor({
              strategy: 'manual',
              cacheBust: cacheBustFn,
            }),
          ])
        ),
        provideHttpClientTesting(),
      ],
    });

    const http = TestBed.inject(HttpClient);
    const httpTesting = TestBed.inject(HttpTestingController);

    http.get('/api/data').subscribe();
    const req = httpTesting.expectOne('/api/data');
    req.flush({});

    expect(cacheBustFn).toHaveBeenCalled();
    httpTesting.verify();
  });
});
