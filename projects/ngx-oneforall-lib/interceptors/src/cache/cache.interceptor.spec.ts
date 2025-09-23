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
import { cacheInterceptor } from './cache.interceptor';
import { CacheService } from '@ngx-oneforall/services';
import { useCache } from './cache-context';

describe('cacheInterceptor', () => {
  let httpTesting: HttpTestingController;
  let http: HttpClient;

  const mockCacheService = {
    has: jest.fn(),
    get: jest.fn(),
    set: jest.fn(),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        { provide: CacheService, useValue: mockCacheService },
        provideHttpClient(withInterceptors([cacheInterceptor])),
        provideHttpClientTesting(),
      ],
    });

    http = TestBed.inject(HttpClient);
    httpTesting = TestBed.inject(HttpTestingController);

    jest.clearAllMocks();
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should return cached response if enabled and cache has key', () => {
    const cachedResponse = { body: 'cached', status: 200 };
    mockCacheService.has.mockReturnValue(true);
    mockCacheService.get.mockReturnValue(cachedResponse);

    http
      .get('/api/data', {
        context: useCache(),
      })
      .subscribe(resp => {
        expect(resp).toEqual(cachedResponse);
        expect(mockCacheService.has).toHaveBeenCalledWith('/api/data');
        expect(mockCacheService.get).toHaveBeenCalledWith('/api/data');
      });
  });

  it('should call next and cache response if enabled and cache does not have key', () => {
    mockCacheService.has.mockReturnValue(false);

    http
      .get('/api/data', {
        context: useCache({ ttl: 1000, storage: 'memory' }),
      })
      .subscribe();

    const req = httpTesting.expectOne('/api/data');
    req.flush({ body: 'fresh' });

    expect(mockCacheService.set).toHaveBeenCalledWith(
      '/api/data',
      expect.any(Object),
      {
        ttl: 1000,
        storage: 'memory',
      }
    );
  });

  it('should use custom key from context', () => {
    mockCacheService.has.mockReturnValue(false);

    http
      .get('/api/data', {
        context: useCache({ key: 'custom-key' }),
      })
      .subscribe();

    const req = httpTesting.expectOne('/api/data');
    req.flush({ body: 'fresh' });

    expect(mockCacheService.set).toHaveBeenCalledWith(
      'custom-key',
      expect.any(Object),
      {
        ttl: undefined,
        storage: undefined,
      }
    );
  });

  it('should use key function from context', () => {
    mockCacheService.has.mockReturnValue(false);

    http
      .get('/api/data', {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        context: useCache({ key: (r: HttpRequest<unknown>) => 'func-key' }),
      })
      .subscribe();

    const req = httpTesting.expectOne('/api/data');
    req.flush({ body: 'fresh' });

    expect(mockCacheService.set).toHaveBeenCalledWith(
      'func-key',
      expect.any(Object),
      {
        ttl: undefined,
        storage: undefined,
      }
    );
  });

  it('should call next if context.enabled is not true', () => {
    http
      .get('/api/data', {
        context: useCache({ enabled: false }),
      })
      .subscribe();

    const req = httpTesting.expectOne('/api/data');
    req.flush({ body: 'not-cached' });

    expect(mockCacheService.has).not.toHaveBeenCalled();
    expect(mockCacheService.get).not.toHaveBeenCalled();
    expect(mockCacheService.set).not.toHaveBeenCalled();
  });
});
