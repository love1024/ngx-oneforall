import { TestBed } from '@angular/core/testing';
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
import { withBaseUrlInterceptor } from './base-url.interceptor';
import { useBaseUrl, BASE_URL_CONTEXT } from './base-url-context';

describe('BaseUrlInterceptor', () => {
  let httpTesting: HttpTestingController;
  let http: HttpClient;

  const configureTestBed = (config: any) => {
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
