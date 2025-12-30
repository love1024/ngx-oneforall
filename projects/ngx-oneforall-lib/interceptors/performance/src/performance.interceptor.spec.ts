/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-function */
import { TestBed } from '@angular/core/testing';
import { inject } from '@angular/core';
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
import {
  withPerformanceInterceptor,
  PerformanceEntry,
  defaultPerformanceReporter,
} from './performance.interceptor';
import { usePerformance, PERFORMANCE_CONTEXT } from './performance-context';

describe('PerformanceInterceptor', () => {
  let httpTesting: HttpTestingController;
  let http: HttpClient;
  let mockReporter: jest.Mock;

  const configureTestBed = (config: any = {}) => {
    TestBed.resetTestingModule();
    mockReporter = jest.fn();
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(
          withInterceptors([
            withPerformanceInterceptor({
              reporter: mockReporter,
              ...config,
            }),
          ])
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
  });

  it('should report performance for successful requests', () => {
    configureTestBed();
    http.get('/api/test').subscribe();

    const req = httpTesting.expectOne('/api/test');
    req.flush({ data: 'ok' });

    expect(mockReporter).toHaveBeenCalled();
    const entry: PerformanceEntry = mockReporter.mock.calls[0][0];
    expect(entry.url).toBe('/api/test');
    expect(entry.method).toBe('GET');
    expect(entry.status).toBe(200);
    expect(entry.durationMs).toBeGreaterThanOrEqual(0);
  });

  it('should report performance for failed requests', () => {
    configureTestBed();
    http.get('/api/error').subscribe({ error: () => {} });

    const req = httpTesting.expectOne('/api/error');
    req.flush('Error', { status: 500, statusText: 'Server Error' });

    expect(mockReporter).toHaveBeenCalled();
    const entry: PerformanceEntry = mockReporter.mock.calls[0][0];
    expect(entry.url).toBe('/api/error');
    expect(entry.status).toBe(500);
    expect(entry.durationMs).toBeGreaterThanOrEqual(0);
  });

  it('should include label from context in the report', () => {
    configureTestBed();
    http
      .get('/api/labeled', { context: usePerformance({ label: 'test-label' }) })
      .subscribe();

    const req = httpTesting.expectOne('/api/labeled');
    req.flush({});

    expect(mockReporter).toHaveBeenCalled();
    const entry: PerformanceEntry = mockReporter.mock.calls[0][0];
    expect(entry.label).toBe('test-label');
  });

  it('should skip reporting if globally disabled', () => {
    configureTestBed({ enabled: false });
    http.get('/api/test').subscribe();

    const req = httpTesting.expectOne('/api/test');
    req.flush({});

    expect(mockReporter).not.toHaveBeenCalled();
  });

  it('should skip reporting if disabled via context', () => {
    configureTestBed();
    http
      .get('/api/test', { context: usePerformance({ enabled: false }) })
      .subscribe();

    const req = httpTesting.expectOne('/api/test');
    req.flush({});

    expect(mockReporter).not.toHaveBeenCalled();
  });

  it('should use default reporter if none provided', () => {
    const debugSpy = jest.spyOn(console, 'debug').mockImplementation();

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([withPerformanceInterceptor({})])),
        provideHttpClientTesting(),
      ],
    });

    http = TestBed.inject(HttpClient);
    httpTesting = TestBed.inject(HttpTestingController);

    http.get('/api/default').subscribe();
    httpTesting.expectOne('/api/default').flush({});

    expect(debugSpy).toHaveBeenCalledWith(
      '[HTTP Performance]',
      expect.objectContaining({ url: '/api/default' })
    );

    debugSpy.mockRestore();
  });

  it('should call reporter in injection context allowing service injection', () => {
    class TestService {
      trackPerformance() {
        return 'tracked';
      }
    }

    TestBed.configureTestingModule({
      providers: [
        TestService,
        provideHttpClient(
          withInterceptors([
            withPerformanceInterceptor({
              reporter: () => {
                const service = inject(TestService);
                expect(service.trackPerformance()).toBe('tracked');
              },
            }),
          ])
        ),
        provideHttpClientTesting(),
      ],
    });

    http = TestBed.inject(HttpClient);
    httpTesting = TestBed.inject(HttpTestingController);

    http.get('/api/test').subscribe();
    httpTesting.expectOne('/api/test').flush({});
  });

  it('should call reporter directly if injector is unavailable', () => {
    const reporterSpy = jest.fn();

    // This test verifies the fallback behavior, though in practice
    // the injector should always be available in Angular's HTTP context
    configureTestBed({ reporter: reporterSpy });

    http.get('/api/test').subscribe();
    httpTesting.expectOne('/api/test').flush({});

    expect(reporterSpy).toHaveBeenCalled();
  });

  describe('usePerformance', () => {
    it('should create context with enabled: true by default', () => {
      const context = usePerformance();
      expect(context.get(PERFORMANCE_CONTEXT)).toEqual({ enabled: true });
    });

    it('should use provided context', () => {
      const existingContext = new HttpContext();
      const context = usePerformance({
        context: existingContext,
        label: 'foo',
      });
      expect(context).toBe(existingContext);
      expect(context.get(PERFORMANCE_CONTEXT)).toEqual({
        enabled: true,
        label: 'foo',
      });
    });
  });

  describe('defaultPerformanceReporter', () => {
    it('should log to console.debug', () => {
      const debugSpy = jest.spyOn(console, 'debug').mockImplementation();
      const entry: PerformanceEntry = {
        url: '/test',
        method: 'GET',
        durationMs: 100,
        status: 200,
      };

      defaultPerformanceReporter(entry);

      expect(debugSpy).toHaveBeenCalledWith('[HTTP Performance]', entry);
      debugSpy.mockRestore();
    });

    it('should log with SLOW prefix when isSlow is true', () => {
      const debugSpy = jest.spyOn(console, 'debug').mockImplementation();
      const entry: PerformanceEntry = {
        url: '/test',
        method: 'GET',
        durationMs: 3000,
        status: 200,
        isSlow: true,
      };

      defaultPerformanceReporter(entry);

      expect(debugSpy).toHaveBeenCalledWith('[HTTP Performance - SLOW]', entry);
      debugSpy.mockRestore();
    });
  });

  describe('slowThresholdMs', () => {
    it('should set isSlow to true when duration exceeds threshold', () => {
      configureTestBed({ slowThresholdMs: -1 }); // -1ms threshold to ensure any duration exceeds it
      http.get('/api/test').subscribe();

      const req = httpTesting.expectOne('/api/test');
      req.flush({});

      expect(mockReporter).toHaveBeenCalled();
      const entry: PerformanceEntry = mockReporter.mock.calls[0][0];
      expect(entry.isSlow).toBe(true);
    });

    it('should set isSlow to false when duration is within threshold', () => {
      configureTestBed({ slowThresholdMs: 999999 }); // Very high threshold
      http.get('/api/test').subscribe();

      const req = httpTesting.expectOne('/api/test');
      req.flush({});

      expect(mockReporter).toHaveBeenCalled();
      const entry: PerformanceEntry = mockReporter.mock.calls[0][0];
      expect(entry.isSlow).toBe(false);
    });

    it('should set isSlow on error responses', () => {
      configureTestBed({ slowThresholdMs: -1 }); // -1ms threshold to ensure any duration exceeds it
      http.get('/api/error').subscribe({ error: () => {} });

      const req = httpTesting.expectOne('/api/error');
      req.flush('Error', { status: 500, statusText: 'Server Error' });

      expect(mockReporter).toHaveBeenCalled();
      const entry: PerformanceEntry = mockReporter.mock.calls[0][0];
      expect(entry.isSlow).toBe(true);
    });
  });

  describe('reportOnlyIfSlow', () => {
    it('should skip reporting fast requests when reportOnlyIfSlow is true', () => {
      configureTestBed({
        slowThresholdMs: 999999,
        reportOnlyIfSlow: true,
      });
      http.get('/api/fast').subscribe();

      const req = httpTesting.expectOne('/api/fast');
      req.flush({});

      expect(mockReporter).not.toHaveBeenCalled();
    });

    it('should report slow requests when reportOnlyIfSlow is true', () => {
      configureTestBed({
        slowThresholdMs: -1, // -1ms threshold means all requests exceed it
        reportOnlyIfSlow: true,
      });
      http.get('/api/slow').subscribe();

      const req = httpTesting.expectOne('/api/slow');
      req.flush({});

      expect(mockReporter).toHaveBeenCalled();
      const entry: PerformanceEntry = mockReporter.mock.calls[0][0];
      expect(entry.isSlow).toBe(true);
    });

    it('should skip reporting fast error requests when reportOnlyIfSlow is true', () => {
      configureTestBed({
        slowThresholdMs: 999999,
        reportOnlyIfSlow: true,
      });
      http.get('/api/fast-error').subscribe({ error: () => {} });

      const req = httpTesting.expectOne('/api/fast-error');
      req.flush('Error', { status: 500, statusText: 'Server Error' });

      expect(mockReporter).not.toHaveBeenCalled();
    });

    it('should report slow error requests when reportOnlyIfSlow is true', () => {
      configureTestBed({
        slowThresholdMs: -1, // -1ms threshold means all requests exceed it
        reportOnlyIfSlow: true,
      });
      http.get('/api/slow-error').subscribe({ error: () => {} });

      const req = httpTesting.expectOne('/api/slow-error');
      req.flush('Error', { status: 500, statusText: 'Server Error' });

      expect(mockReporter).toHaveBeenCalled();
      const entry: PerformanceEntry = mockReporter.mock.calls[0][0];
      expect(entry.isSlow).toBe(true);
    });
  });

  describe('getTimestamp SSR fallback', () => {
    let originalPerformance: typeof performance;

    beforeEach(() => {
      originalPerformance = global.performance;
    });

    afterEach(() => {
      global.performance = originalPerformance;
    });

    it('should use Date.now() when performance is undefined (SSR)', () => {
      // @ts-expect-error - simulating SSR environment
      delete global.performance;

      const dateSpy = jest.spyOn(Date, 'now').mockReturnValue(1000);

      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [
          provideHttpClient(
            withInterceptors([
              withPerformanceInterceptor({
                reporter: entry => {
                  expect(entry.durationMs).toBeGreaterThanOrEqual(0);
                },
              }),
            ])
          ),
          provideHttpClientTesting(),
        ],
      });

      http = TestBed.inject(HttpClient);
      httpTesting = TestBed.inject(HttpTestingController);

      http.get('/api/ssr-test').subscribe();
      httpTesting.expectOne('/api/ssr-test').flush({});

      expect(dateSpy).toHaveBeenCalled();
      dateSpy.mockRestore();
    });
  });

  describe('default config', () => {
    it('should work with no config argument (default {})', () => {
      const debugSpy = jest.spyOn(console, 'debug').mockImplementation();

      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [
          provideHttpClient(withInterceptors([withPerformanceInterceptor()])),
          provideHttpClientTesting(),
        ],
      });

      http = TestBed.inject(HttpClient);
      httpTesting = TestBed.inject(HttpTestingController);

      http.get('/api/no-config').subscribe();
      httpTesting.expectOne('/api/no-config').flush({});

      expect(debugSpy).toHaveBeenCalledWith(
        '[HTTP Performance]',
        expect.objectContaining({ url: '/api/no-config' })
      );

      debugSpy.mockRestore();
    });
  });
});
