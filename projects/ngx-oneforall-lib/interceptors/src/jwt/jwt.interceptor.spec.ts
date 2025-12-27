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
import { jwtInterceptor, resetJwtInterceptor } from './jwt.interceptor';
import { JwtService, provideJwtService } from '@ngx-oneforall/services/jwt';
import { PLATFORM_ID } from '@angular/core';
import { of, throwError, Subject } from 'rxjs';
import { withSkipJwtInterceptor } from './jwt-context';

describe('jwtInterceptor', () => {
  let httpTesting: HttpTestingController;
  let http: HttpClient;

  const mockJwtService = {
    getConfig: jest.fn(),
    getToken: jest.fn(),
    isExpired: jest.fn(),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        provideJwtService(),
        provideHttpClient(withInterceptors([jwtInterceptor])),
        provideHttpClientTesting(),
        { provide: JwtService, useValue: mockJwtService },
      ],
    });

    http = TestBed.inject(HttpClient);
    httpTesting = TestBed.inject(HttpTestingController);

    jest.clearAllMocks();
  });

  afterEach(() => {
    httpTesting.verify();
    resetJwtInterceptor();
  });

  it('should add Authorization header when token exists', () => {
    mockJwtService.getConfig.mockReturnValue({});
    mockJwtService.getToken.mockReturnValue('abc123');
    mockJwtService.isExpired.mockReturnValue(false);

    http.get('/api/test').subscribe();

    const req = httpTesting.expectOne('/api/test');
    expect(req.request.headers.get('Authorization')).toBe('Bearer abc123');
    req.flush({});
  });

  it('should skip if no token and errorOnNoToken=false', () => {
    mockJwtService.getConfig.mockReturnValue({ errorOnNoToken: false });
    mockJwtService.getToken.mockReturnValue(null);

    http.get('/api/test').subscribe();

    const req = httpTesting.expectOne('/api/test');
    expect(req.request.headers.has('Authorization')).toBe(false);
    req.flush({});
  });

  it('should throw error if no token and errorOnNoToken=true', done => {
    mockJwtService.getConfig.mockReturnValue({ errorOnNoToken: true });
    mockJwtService.getToken.mockReturnValue(null);

    http.get('/api/test').subscribe({
      next: () => fail('Expected an error, but got success'),
      error: err => {
        expect(err.message).toBe(
          '[NgxOneforall - JWT Interceptor]: Token getter returned no token'
        );
        done();
      },
    });
  });

  it('should skip if token is expired and skipAddingIfExpired=true', () => {
    mockJwtService.getConfig.mockReturnValue({ skipAddingIfExpired: true });
    mockJwtService.getToken.mockReturnValue('expiredToken');
    mockJwtService.isExpired.mockReturnValue(true);

    http.get('/api/test').subscribe();

    const req = httpTesting.expectOne('/api/test');
    expect(req.request.headers.has('Authorization')).toBe(false);
    req.flush({});
  });

  it('should skip if request domain is not in allowedDomains', () => {
    mockJwtService.getConfig.mockReturnValue({
      allowedDomains: ['allowed.com'],
    });
    mockJwtService.getToken.mockReturnValue('abc123');
    mockJwtService.isExpired.mockReturnValue(false);

    http.get('https://other.com/api/test').subscribe();

    const req = httpTesting.expectOne('https://other.com/api/test');
    expect(req.request.headers.has('Authorization')).toBe(false);
    req.flush({});
  });

  it('should skip if request URL matches excludedRoutes', () => {
    mockJwtService.getConfig.mockReturnValue({
      skipUrls: ['https://example.com/api/auth'],
    });
    mockJwtService.getToken.mockReturnValue('abc123');
    mockJwtService.isExpired.mockReturnValue(false);

    http.get('https://example.com/api/auth').subscribe();

    const req = httpTesting.expectOne('https://example.com/api/auth');
    expect(req.request.headers.has('Authorization')).toBe(false);
    req.flush({});
  });

  it('should respect custom headerName and authScheme', () => {
    mockJwtService.getConfig.mockReturnValue({
      headerName: 'X-Custom-Auth',
      authScheme: 'JWT ',
    });
    mockJwtService.getToken.mockReturnValue('xyz456');
    mockJwtService.isExpired.mockReturnValue(false);

    http.get('/api/test').subscribe();

    const req = httpTesting.expectOne('/api/test');
    expect(req.request.headers.get('X-Custom-Auth')).toBe('JWT xyz456');
    req.flush({});
  });

  it('should add header if request origin is same as current location origin even if not given in domains', () => {
    mockJwtService.getConfig.mockReturnValue({
      allowedDomains: ['http://gatherbits.com'],
    });
    mockJwtService.getToken.mockReturnValue('abc123');
    mockJwtService.isExpired.mockReturnValue(false);

    http.get(document.location.origin).subscribe();

    const req = httpTesting.expectOne(document.location.origin);
    expect(req.request.headers.has('Authorization')).toBe(true);
    req.flush({});
  });

  it('should work with regex in included domains', () => {
    mockJwtService.getConfig.mockReturnValue({
      allowedDomains: [/gatherbits.com/],
    });
    mockJwtService.getToken.mockReturnValue('abc');
    mockJwtService.isExpired.mockReturnValue(false);

    http.get('https://gatherbits.com').subscribe();

    const req = httpTesting.expectOne('https://gatherbits.com');
    expect(req.request.headers.has('Authorization')).toBe(true);
    req.flush({});
  });

  it('should work with port in included domains', () => {
    mockJwtService.getConfig.mockReturnValue({
      allowedDomains: ['localhost:3000'],
    });
    mockJwtService.getToken.mockReturnValue('abc');
    mockJwtService.isExpired.mockReturnValue(false);

    http.get('http://localhost:3000').subscribe();

    const req = httpTesting.expectOne('http://localhost:3000');
    expect(req.request.headers.has('Authorization')).toBe(true);
    req.flush({});
  });

  it('should work with regex in disallowed routes', () => {
    mockJwtService.getConfig.mockReturnValue({
      skipUrls: [/localhost:3000/],
    });
    mockJwtService.getToken.mockReturnValue('abc');
    mockJwtService.isExpired.mockReturnValue(false);

    http.get('http://localhost:3000').subscribe();

    const req = httpTesting.expectOne('http://localhost:3000');
    expect(req.request.headers.has('Authorization')).toBe(false);
    req.flush({});
  });

  it('should use default config if not provided', () => {
    mockJwtService.getConfig.mockReturnValue(null);
    mockJwtService.getToken.mockReturnValue('abc');
    mockJwtService.isExpired.mockReturnValue(false);

    http.get('http://localhost:3000').subscribe();

    const req = httpTesting.expectOne('http://localhost:3000');
    expect(req.request.headers.has('Authorization')).toBe(true);
    req.flush({});
  });

  it('should refresh token and retry on 401 if refreshTokenHandler is provided', () => {
    const mockHandler = {
      refreshToken: jest.fn().mockReturnValue(of('new-token')),
      logout: jest.fn(),
    };
    mockJwtService.getConfig.mockReturnValue({
      refreshTokenHandler: mockHandler,
    });
    mockJwtService.getToken.mockReturnValue('old-token');
    mockJwtService.isExpired.mockReturnValue(false);

    http.get('/api/test').subscribe(res => {
      expect(res).toEqual({ success: true });
    });

    const req1 = httpTesting.expectOne('/api/test');
    expect(req1.request.headers.get('Authorization')).toBe('Bearer old-token');
    req1.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });

    expect(mockHandler.refreshToken).toHaveBeenCalled();

    const req2 = httpTesting.expectOne('/api/test');
    expect(req2.request.headers.get('Authorization')).toBe('Bearer new-token');
    req2.flush({ success: true });
  });

  it('should NOT handle 401 error if refreshTokenHandler is NOT provided', done => {
    mockJwtService.getConfig.mockReturnValue({
      // No refreshTokenHandler
    });
    mockJwtService.getToken.mockReturnValue('old-token');
    mockJwtService.isExpired.mockReturnValue(false);

    http.get('/api/test').subscribe({
      next: () => fail('Should have failed'),
      error: err => {
        expect(err.status).toBe(401);
        done();
      },
    });

    const req = httpTesting.expectOne('/api/test');
    req.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });

    // No logic related to refresh or new requests should happen
  });

  it('should handle concurrent 401s and only refresh once', fakeAsync(() => {
    const refreshSubject = new Subject<string>();
    const mockHandler = {
      refreshToken: jest.fn().mockReturnValue(refreshSubject.asObservable()),
      logout: jest.fn(),
    };
    mockJwtService.getConfig.mockReturnValue({
      refreshTokenHandler: mockHandler,
    });
    mockJwtService.getToken.mockReturnValue('old-token');
    mockJwtService.isExpired.mockReturnValue(false);

    const results: any[] = [];
    http.get('/test-1').subscribe(res => results.push(res));
    http.get('/test-2').subscribe(res => results.push(res));

    const req1 = httpTesting.expectOne('/test-1');
    const req2 = httpTesting.expectOne('/test-2');

    // Fail both requests
    req1.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });
    req2.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });

    tick();

    // Should be called once and waiting
    expect(mockHandler.refreshToken).toHaveBeenCalledTimes(1);

    // Emit new token
    refreshSubject.next('shared-token');
    refreshSubject.complete();

    tick();

    const retry1 = httpTesting.expectOne('/test-1');
    const retry2 = httpTesting.expectOne('/test-2');

    expect(retry1.request.headers.get('Authorization')).toBe(
      'Bearer shared-token'
    );
    expect(retry2.request.headers.get('Authorization')).toBe(
      'Bearer shared-token'
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
    mockJwtService.getConfig.mockReturnValue({
      refreshTokenHandler: mockHandler,
    });
    mockJwtService.getToken.mockReturnValue('old-token');
    mockJwtService.isExpired.mockReturnValue(false);

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
    mockJwtService.getConfig.mockReturnValue({});
    mockJwtService.getToken.mockReturnValue('abc123');

    http
      .get('/api/auth/login', { context: withSkipJwtInterceptor() })
      .subscribe();

    const req = httpTesting.expectOne('/api/auth/login');
    expect(req.request.headers.has('Authorization')).toBe(false);
    req.flush({});

    expect(mockJwtService.getToken).not.toHaveBeenCalled();
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
      // Mock URL to throw error
      global.URL = jest.fn(() => {
        throw new Error('Invalid URL');
      }) as any;

      mockJwtService.getConfig.mockReturnValue({
        allowedDomains: ['example.com'],
      });
      mockJwtService.getToken.mockReturnValue('abc123');
      mockJwtService.isExpired.mockReturnValue(false);

      http.get('/api/test').subscribe();

      const req = httpTesting.expectOne('/api/test');
      expect(req.request.headers.has('Authorization')).toBe(false);
      req.flush({});
    });

    it('should add token if URL parsing fails and only skipUrls is set (fails safe)', () => {
      // Mock URL to throw error
      global.URL = jest.fn(() => {
        throw new Error('Invalid URL');
      }) as any;

      mockJwtService.getConfig.mockReturnValue({
        skipUrls: ['/api/test'],
      });
      mockJwtService.getToken.mockReturnValue('abc123');
      mockJwtService.isExpired.mockReturnValue(false);

      http.get('/api/test').subscribe();

      const req = httpTesting.expectOne('/api/test');
      // Should default to adding token because isDisallowedRoute returns false when URL is invalid
      expect(req.request.headers.has('Authorization')).toBe(true);
      req.flush({});
    });
  });
});

describe('jwtInterceptor', () => {
  let httpTesting: HttpTestingController;
  let http: HttpClient;

  const mockJwtService = {
    getConfig: jest.fn(),
    getToken: jest.fn(),
    isExpired: jest.fn(),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        provideJwtService(),
        provideHttpClient(withInterceptors([jwtInterceptor])),
        provideHttpClientTesting(),
        { provide: JwtService, useValue: mockJwtService },
        { provide: PLATFORM_ID, useValue: 'server' },
      ],
    });

    http = TestBed.inject(HttpClient);
    httpTesting = TestBed.inject(HttpTestingController);

    jest.clearAllMocks();
  });

  it('should skip adding authorization header if not browser', () => {
    mockJwtService.getConfig.mockReturnValue({});
    mockJwtService.getToken.mockReturnValue('abc123');
    mockJwtService.isExpired.mockReturnValue(false);

    http.get('/api/test').subscribe();

    const req = httpTesting.expectOne('/api/test');
    expect(req.request.headers.has('Authorization')).toBe(false);
    req.flush({});
  });
});
