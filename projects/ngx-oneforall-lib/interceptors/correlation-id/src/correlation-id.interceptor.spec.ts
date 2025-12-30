/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
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
import { PLATFORM_ID } from '@angular/core';
import { withCorrelationIdInterceptor } from './correlation-id.interceptor';
import {
  CORRELATION_ID_CONTEXT,
  useCorrelationId,
} from './correlation-id-context';

describe('CorrelationIdInterceptor', () => {
  let httpTesting: HttpTestingController;
  let http: HttpClient;

  const configureTestBed = (config?: any, platformId: any = 'browser') => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(
          withInterceptors([withCorrelationIdInterceptor(config)])
        ),
        provideHttpClientTesting(),
        { provide: PLATFORM_ID, useValue: platformId },
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

  it('should add X-Correlation-Id header by default in browser', () => {
    configureTestBed();
    http.get('/api/test').subscribe();

    const req = httpTesting.expectOne('/api/test');
    expect(req.request.headers.has('X-Correlation-Id')).toBe(true);
    expect(req.request.headers.get('X-Correlation-Id')).toBeDefined();
    req.flush({});
  });

  it('should add header on server platform', () => {
    configureTestBed(undefined, 'server');
    http.get('/api/test').subscribe();

    const req = httpTesting.expectOne('/api/test');
    expect(req.request.headers.has('X-Correlation-Id')).toBe(true);
    req.flush({});
  });

  it('should not override existing header', () => {
    configureTestBed();
    http
      .get('/api/test', { headers: { 'X-Correlation-Id': 'existing-id' } })
      .subscribe();

    const req = httpTesting.expectOne('/api/test');
    expect(req.request.headers.get('X-Correlation-Id')).toBe('existing-id');
    req.flush({});
  });

  it('should use custom header name if provided', () => {
    configureTestBed({ header: 'Custom-Id' });
    http.get('/api/test').subscribe();

    const req = httpTesting.expectOne('/api/test');
    expect(req.request.headers.has('Custom-Id')).toBe(true);
    expect(req.request.headers.has('X-Correlation-Id')).toBe(false);
    req.flush({});
  });

  it('should use custom id generator if provided', () => {
    const customGenerator = () => 'custom-uuid';
    configureTestBed({ idGenerator: customGenerator });
    http.get('/api/test').subscribe();

    const req = httpTesting.expectOne('/api/test');
    expect(req.request.headers.get('X-Correlation-Id')).toBe('custom-uuid');
    req.flush({});
  });

  it('should not add header if disabled via context', () => {
    configureTestBed();
    http
      .get('/api/test', { context: useCorrelationId({ enabled: false }) })
      .subscribe();

    const req = httpTesting.expectOne('/api/test');
    expect(req.request.headers.has('X-Correlation-Id')).toBe(false);
    req.flush({});
  });

  it('should use ID from context if provided', () => {
    configureTestBed();
    http
      .get('/api/test', { context: useCorrelationId({ id: 'context-id' }) })
      .subscribe();

    const req = httpTesting.expectOne('/api/test');
    expect(req.request.headers.get('X-Correlation-Id')).toBe('context-id');
    req.flush({});
  });

  describe('defaultIdGenerator', () => {
    it('should fallback if crypto.randomUUID is not available', () => {
      // @ts-ignore
      const originalRandomUUID = crypto.randomUUID;
      // @ts-ignore
      crypto.randomUUID = undefined;

      try {
        configureTestBed();
        http.get('/api/test').subscribe();
        const req = httpTesting.expectOne('/api/test');
        const id = req.request.headers.get('X-Correlation-Id');
        // Expected format: timestamp-random
        expect(id).toMatch(/^\d+-[a-f0-9]+$/);
        req.flush({});
      } finally {
        // @ts-ignore
        crypto.randomUUID = originalRandomUUID;
      }
    });

    it('should use crypto.randomUUID if available', () => {
      configureTestBed();
      http.get('/api/test').subscribe();
      const req = httpTesting.expectOne('/api/test');
      const id = req.request.headers.get('X-Correlation-Id');

      // UUID v4 format roughly
      expect(id?.length).toBeGreaterThan(10);
      req.flush({});
    });
  });

  describe('useCorrelationId', () => {
    it('should work with default parameters', () => {
      const context = useCorrelationId();
      expect(context.get(CORRELATION_ID_CONTEXT)).toEqual({ enabled: true });
    });

    it('should use provided context', () => {
      const existingContext = new HttpContext();
      const context = useCorrelationId({
        context: existingContext,
        id: 'test',
      });
      expect(context).toBe(existingContext);
      expect(context.get(CORRELATION_ID_CONTEXT)).toEqual({
        enabled: true,
        id: 'test',
      });
    });
  });
});
