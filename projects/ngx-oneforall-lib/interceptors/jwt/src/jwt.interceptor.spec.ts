/* eslint-disable @typescript-eslint/no-explicit-any */
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import {
  HttpClient,
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import {
  withJwtInterceptor,
  resetJwtInterceptor,
  JwtInterceptorConfig,
} from './jwt.interceptor';
import { PLATFORM_ID } from '@angular/core';
import { of, throwError, Subject } from 'rxjs';
import { withSkipJwtInterceptor } from './jwt-context';

// Helper to create mock JWT tokens - must be at top for use in tests
function createMockJwt(payload: Record<string, unknown> = {}): string {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body = btoa(
    JSON.stringify({ exp: Math.floor(Date.now() / 1000) + 3600, ...payload })
  );
  const signature = 'mock-signature';
  return `${header}.${body}.${signature}`;
}

// Pre-create valid test tokens
const VALID_TOKEN = createMockJwt();
const EXPIRED_TOKEN = createMockJwt({
  exp: Math.floor(Date.now() / 1000) - 3600,
});

describe('withJwtInterceptor', () => {
  let httpTesting: HttpTestingController;
  let http: HttpClient;

  const setupTestBed = (config: Partial<JwtInterceptorConfig> = {}) => {
    TestBed.resetTestingModule();
    const defaultConfig: JwtInterceptorConfig = {
      tokenGetter: () => VALID_TOKEN,
      ...config,
    };

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(
          withInterceptors([withJwtInterceptor(defaultConfig)])
        ),
        provideHttpClientTesting(),
      ],
    });

    http = TestBed.inject(HttpClient);
    httpTesting = TestBed.inject(HttpTestingController);
  };

  afterEach(() => {
    if (httpTesting) {
      httpTesting.verify();
    }
    resetJwtInterceptor();
  });

  it('should throw error if tokenGetter is not provided', () => {
    expect(() => withJwtInterceptor({} as any)).toThrow(
      '[NgxOneforall - JwtInterceptor]: tokenGetter is required'
    );
  });

  it('should add Authorization header when token exists', () => {
    const token = createMockJwt();
    setupTestBed({ tokenGetter: () => token });

    http.get('/api/test').subscribe();

    const req = httpTesting.expectOne('/api/test');
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${token}`);
    req.flush({});
  });

  it('should skip if no token and errorOnNoToken=false', () => {
    setupTestBed({
      tokenGetter: () => null,
      errorOnNoToken: false,
    });

    http.get('/api/test').subscribe();

    const req = httpTesting.expectOne('/api/test');
    expect(req.request.headers.has('Authorization')).toBe(false);
    req.flush({});
  });

  it('should throw error if no token and errorOnNoToken=true', done => {
    setupTestBed({
      tokenGetter: () => null,
      errorOnNoToken: true,
    });

    http.get('/api/test').subscribe({
      next: () => fail('Expected an error, but got success'),
      error: err => {
        expect(err.message).toBe(
          '[NgxOneforall - JwtInterceptor]: tokenGetter returned no token'
        );
        done();
      },
    });
  });

  it('should skip if token is expired and skipAddingIfExpired=true', () => {
    setupTestBed({
      tokenGetter: () => EXPIRED_TOKEN,
      skipAddingIfExpired: true,
    });

    http.get('/api/test').subscribe();

    const req = httpTesting.expectOne('/api/test');
    expect(req.request.headers.has('Authorization')).toBe(false);
    req.flush({});
  });

  it('should skip if request domain is not in allowedDomains', () => {
    setupTestBed({
      allowedDomains: ['allowed.com'],
    });

    http.get('https://other.com/api/test').subscribe();

    const req = httpTesting.expectOne('https://other.com/api/test');
    expect(req.request.headers.has('Authorization')).toBe(false);
    req.flush({});
  });

  it('should skip if request URL matches skipUrls', () => {
    setupTestBed({
      skipUrls: ['https://example.com/api/auth'],
    });

    http.get('https://example.com/api/auth').subscribe();

    const req = httpTesting.expectOne('https://example.com/api/auth');
    expect(req.request.headers.has('Authorization')).toBe(false);
    req.flush({});
  });

  it('should respect custom headerName and authScheme', () => {
    const token = createMockJwt();
    setupTestBed({
      tokenGetter: () => token,
      headerName: 'X-Custom-Auth',
      authScheme: 'JWT ',
    });

    http.get('/api/test').subscribe();

    const req = httpTesting.expectOne('/api/test');
    expect(req.request.headers.get('X-Custom-Auth')).toBe(`JWT ${token}`);
    req.flush({});
  });

  it('should add header if request origin is same as current location origin', () => {
    setupTestBed({
      allowedDomains: ['http://gatherbits.com'],
    });

    http.get(document.location.origin).subscribe();

    const req = httpTesting.expectOne(document.location.origin);
    expect(req.request.headers.has('Authorization')).toBe(true);
    req.flush({});
  });

  it('should work with regex in allowedDomains', () => {
    setupTestBed({
      allowedDomains: [/gatherbits.com/],
    });

    http.get('https://gatherbits.com').subscribe();

    const req = httpTesting.expectOne('https://gatherbits.com');
    expect(req.request.headers.has('Authorization')).toBe(true);
    req.flush({});
  });

  it('should work with port in allowedDomains', () => {
    setupTestBed({
      allowedDomains: ['localhost:3000'],
    });

    http.get('http://localhost:3000').subscribe();

    const req = httpTesting.expectOne('http://localhost:3000');
    expect(req.request.headers.has('Authorization')).toBe(true);
    req.flush({});
  });

  it('should work with regex in skipUrls', () => {
    setupTestBed({
      skipUrls: [/localhost:3000/],
    });

    http.get('http://localhost:3000').subscribe();

    const req = httpTesting.expectOne('http://localhost:3000');
    expect(req.request.headers.has('Authorization')).toBe(false);
    req.flush({});
  });

  it('should refresh token and retry on 401 if refreshTokenHandler is provided', () => {
    const newToken = createMockJwt({ sub: 'new' });
    const mockHandler = {
      refreshToken: jest.fn().mockReturnValue(of(newToken)),
      logout: jest.fn(),
    };
    setupTestBed({
      refreshTokenHandler: mockHandler,
    });

    http.get('/api/test').subscribe(res => {
      expect(res).toEqual({ success: true });
    });

    const req1 = httpTesting.expectOne('/api/test');
    expect(req1.request.headers.has('Authorization')).toBe(true);
    req1.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });

    expect(mockHandler.refreshToken).toHaveBeenCalled();

    const req2 = httpTesting.expectOne('/api/test');
    expect(req2.request.headers.get('Authorization')).toBe(
      `Bearer ${newToken}`
    );
    req2.flush({ success: true });
  });

  it('should NOT handle 401 error if refreshTokenHandler is NOT provided', done => {
    setupTestBed();

    http.get('/api/test').subscribe({
      next: () => fail('Should have failed'),
      error: err => {
        expect(err.status).toBe(401);
        done();
      },
    });

    const req = httpTesting.expectOne('/api/test');
    req.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });
  });

  it('should handle concurrent 401s and only refresh once', fakeAsync(() => {
    const refreshSubject = new Subject<string>();
    const mockHandler = {
      refreshToken: jest.fn().mockReturnValue(refreshSubject.asObservable()),
      logout: jest.fn(),
    };
    setupTestBed({
      refreshTokenHandler: mockHandler,
    });

    const results: any[] = [];
    http.get('/test-1').subscribe(res => results.push(res));
    http.get('/test-2').subscribe(res => results.push(res));

    const req1 = httpTesting.expectOne('/test-1');
    const req2 = httpTesting.expectOne('/test-2');

    req1.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });
    req2.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });

    tick();

    expect(mockHandler.refreshToken).toHaveBeenCalledTimes(1);

    const sharedToken = createMockJwt({ sub: 'shared' });
    refreshSubject.next(sharedToken);
    refreshSubject.complete();

    tick();

    const retry1 = httpTesting.expectOne('/test-1');
    const retry2 = httpTesting.expectOne('/test-2');

    expect(retry1.request.headers.get('Authorization')).toBe(
      `Bearer ${sharedToken}`
    );
    expect(retry2.request.headers.get('Authorization')).toBe(
      `Bearer ${sharedToken}`
    );

    retry1.flush({ id: 1 });
    retry2.flush({ id: 2 });

    expect(results).toEqual([{ id: 1 }, { id: 2 }]);
  }));

  it('should logout and throw error if refresh fails', () => {
    const mockHandler = {
      refreshToken: jest
        .fn()
        .mockReturnValue(throwError(() => new Error('Refresh failed'))),
      logout: jest.fn(),
    };
    setupTestBed({
      refreshTokenHandler: mockHandler,
    });

    let capturedError: any;
    http.get('/api/test').subscribe({
      next: () => fail('Should have failed'),
      error: err => (capturedError = err),
    });

    const req = httpTesting.expectOne('/api/test');
    req.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });

    expect(mockHandler.refreshToken).toHaveBeenCalled();
    expect(mockHandler.logout).toHaveBeenCalled();
    expect(capturedError).toBeDefined();
  });

  it('should skip everything if SKIP_JWT_INTERCEPTOR context is set', () => {
    setupTestBed();

    http
      .get('/api/auth/login', { context: withSkipJwtInterceptor() })
      .subscribe();

    const req = httpTesting.expectOne('/api/auth/login');
    expect(req.request.headers.has('Authorization')).toBe(false);
    req.flush({});
  });

  describe('Invalid URL handling', () => {
    let originalURL: typeof URL;

    beforeEach(() => {
      originalURL = global.URL;
    });

    afterEach(() => {
      global.URL = originalURL;
    });

    it('should NOT add token if URL parsing fails and allowedDomains is set', () => {
      global.URL = jest.fn(() => {
        throw new Error('Invalid URL');
      }) as any;

      setupTestBed({
        allowedDomains: ['example.com'],
      });

      http.get('/api/test').subscribe();

      const req = httpTesting.expectOne('/api/test');
      expect(req.request.headers.has('Authorization')).toBe(false);
      req.flush({});
    });

    it('should add token if URL parsing fails and only skipUrls is set', () => {
      global.URL = jest.fn(() => {
        throw new Error('Invalid URL');
      }) as any;

      setupTestBed({
        skipUrls: ['/api/test'],
      });

      http.get('/api/test').subscribe();

      const req = httpTesting.expectOne('/api/test');
      expect(req.request.headers.has('Authorization')).toBe(true);
      req.flush({});
    });
  });
});

describe('withJwtInterceptor SSR', () => {
  let httpTesting: HttpTestingController;
  let http: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(
          withInterceptors([
            withJwtInterceptor({ tokenGetter: () => VALID_TOKEN }),
          ])
        ),
        provideHttpClientTesting(),
        { provide: PLATFORM_ID, useValue: 'server' },
      ],
    });

    http = TestBed.inject(HttpClient);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
    resetJwtInterceptor();
  });

  it('should skip adding authorization header if not browser', () => {
    http.get('/api/test').subscribe();

    const req = httpTesting.expectOne('/api/test');
    expect(req.request.headers.has('Authorization')).toBe(false);
    req.flush({});
  });
});
