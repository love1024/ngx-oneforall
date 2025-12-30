/* eslint-disable @typescript-eslint/no-explicit-any */
import { TestBed } from '@angular/core/testing';
import { InjectionToken, inject } from '@angular/core';
import {
  HttpClient,
  HttpContext,
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { withBaseUrlInterceptor, BaseUrlConfig } from './base-url.interceptor';
import { useBaseUrl, BASE_URL_CONTEXT } from './base-url-context';

describe('BaseUrlInterceptor', () => {
  let httpTesting: HttpTestingController;
  let http: HttpClient;

  const configureTestBed = (config: BaseUrlConfig) => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([withBaseUrlInterceptor(config)])),
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
  });

  it('should prepend base URL to relative request URL', () => {
    configureTestBed({ baseUrl: 'https://api.example.com' });
    http.get('/users').subscribe();

    const req = httpTesting.expectOne('https://api.example.com/users');
    expect(req.request.url).toBe('https://api.example.com/users');
    req.flush({});
  });

  it('should handle slashes correctly when joining', () => {
    configureTestBed({ baseUrl: 'https://api.example.com/' });
    http.get('/users').subscribe();
    httpTesting.expectOne('https://api.example.com/users').flush({});

    http.get('users').subscribe();
    httpTesting.expectOne('https://api.example.com/users').flush({});
  });

  it('should skip if request URL is already absolute', () => {
    configureTestBed({ baseUrl: 'https://api.example.com' });
    const absoluteUrl = 'https://other-api.com/data';
    http.get(absoluteUrl).subscribe();

    const req = httpTesting.expectOne(absoluteUrl);
    expect(req.request.url).toBe(absoluteUrl);
    req.flush({});
  });

  it('should skip if disabled via context', () => {
    configureTestBed({ baseUrl: 'https://api.example.com' });
    http.get('/users', { context: useBaseUrl({ enabled: false }) }).subscribe();

    const req = httpTesting.expectOne('/users');
    expect(req.request.url).toBe('/users');
    req.flush({});
  });

  it('should use baseUrl from context if provided', () => {
    configureTestBed({ baseUrl: 'https://api.example.com' });
    http
      .get('/users', {
        context: useBaseUrl({ baseUrl: 'https://custom-api.com' }),
      })
      .subscribe();

    const req = httpTesting.expectOne('https://custom-api.com/users');
    expect(req.request.url).toBe('https://custom-api.com/users');
    req.flush({});
  });

  it('should throw error if baseUrl is not provided in interceptor config', () => {
    expect(() => withBaseUrlInterceptor({} as any)).toThrow(
      '[BaseUrlInterceptor] baseUrl must be provided'
    );
  });

  it('should support baseUrl as a function with injection context', () => {
    const API_URL = new InjectionToken<string>('API_URL');
    TestBed.configureTestingModule({
      providers: [
        { provide: API_URL, useValue: 'https://injected.example.com' },
        provideHttpClient(
          withInterceptors([
            withBaseUrlInterceptor({
              baseUrl: () => inject(API_URL),
            }),
          ])
        ),
        provideHttpClientTesting(),
      ],
    });

    http = TestBed.inject(HttpClient);
    httpTesting = TestBed.inject(HttpTestingController);

    http.get('/injected').subscribe();
    httpTesting.expectOne('https://injected.example.com/injected').flush({});
  });

  it('should support baseUrl in context as a function', () => {
    configureTestBed({ baseUrl: 'https://default.com' });
    http
      .get('/context-fn', {
        context: useBaseUrl({ baseUrl: () => 'https://context-fn.com' }),
      })
      .subscribe();

    httpTesting.expectOne('https://context-fn.com/context-fn').flush({});
  });

  it('should use override url if request starts with override config', () => {
    configureTestBed({
      baseUrl: 'https://api.example.com',
      overrides: [{ startWith: 'auth', url: 'https://auth.example.com' }],
    });

    http.get('/auth/login').subscribe();
    httpTesting.expectOne('https://auth.example.com/auth/login').flush({});

    http.get('/users').subscribe();
    httpTesting.expectOne('https://api.example.com/users').flush({});
  });

  it('should handle multiple overrides and pick first match', () => {
    configureTestBed({
      baseUrl: 'https://api.example.com',
      overrides: [
        { startWith: 'auth', url: 'https://auth.example.com' },
        { startWith: 'admin', url: 'https://admin.example.com' },
      ],
    });

    http.get('/admin/dashboard').subscribe();
    httpTesting
      .expectOne('https://admin.example.com/admin/dashboard')
      .flush({});
  });

  it('should support override url as function', () => {
    configureTestBed({
      baseUrl: 'https://api.example.com',
      overrides: [
        { startWith: 'assets', url: () => 'https://cdn.example.com' },
      ],
    });

    http.get('/assets/logo.png').subscribe();
    httpTesting.expectOne('https://cdn.example.com/assets/logo.png').flush({});
  });

  describe('useBaseUrl', () => {
    it('should return context with token and enabled: true', () => {
      const context = useBaseUrl();
      expect(context.get(BASE_URL_CONTEXT)).toEqual({ enabled: true });
    });

    it('should use existing context if provided', () => {
      const existingContext = new HttpContext();
      const context = useBaseUrl({ context: existingContext, baseUrl: 'foo' });
      expect(context).toBe(existingContext);
      expect(context.get(BASE_URL_CONTEXT)).toEqual({
        enabled: true,
        baseUrl: 'foo',
      });
    });
  });
});
