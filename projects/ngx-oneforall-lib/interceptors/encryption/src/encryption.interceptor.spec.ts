/* eslint-disable @typescript-eslint/no-explicit-any */
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
import {
  withEncryptionInterceptor,
  EncryptionAdapter,
  EncryptionInterceptorConfig,
} from './encryption.interceptor';
import { useEncryption, ENCRYPTION_CONTEXT } from './encryption-context';

describe('EncryptionInterceptor', () => {
  let httpTesting: HttpTestingController;
  let http: HttpClient;
  let mockAdapter: jest.Mocked<EncryptionAdapter>;

  const configureTestBed = (
    config: Partial<EncryptionInterceptorConfig> = {}
  ) => {
    mockAdapter = {
      encrypt: jest.fn(data => `encrypted:${JSON.stringify(data)}`),
      decrypt: jest.fn(data =>
        JSON.parse((data as string).replace('encrypted:', ''))
      ),
    };

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(
          withInterceptors([
            withEncryptionInterceptor({
              adapter: mockAdapter,
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

  it('should encrypt request body and add default header', () => {
    configureTestBed();
    const body = { test: 'data' };
    http.post('/api/test', body).subscribe();

    const req = httpTesting.expectOne('/api/test');
    expect(req.request.body).toBe(`encrypted:${JSON.stringify(body)}`);
    expect(req.request.headers.get('X-Encrypted-Data')).toBe('1');
    req.flush({});

    expect(mockAdapter.encrypt).toHaveBeenCalledWith(body);
  });

  it('should decrypt response body', () => {
    configureTestBed();
    let responseData: any;
    const body = { result: 'ok' };
    http.get('/api/test').subscribe(res => (responseData = res));

    const req = httpTesting.expectOne('/api/test');
    req.flush(`encrypted:${JSON.stringify(body)}`);

    expect(responseData).toEqual(body);
    expect(mockAdapter.decrypt).toHaveBeenCalledWith(
      `encrypted:${JSON.stringify(body)}`
    );
  });

  it('should use custom header name', () => {
    configureTestBed({ headerName: 'X-My-Encryption' });
    http.post('/api/test', { data: 123 }).subscribe();

    const req = httpTesting.expectOne('/api/test');
    expect(req.request.headers.has('X-My-Encryption')).toBe(true);
    req.flush({});
  });

  it('should skip encryption/decryption if globally disabled', () => {
    configureTestBed({ enabled: false });
    const body = { data: 123 };
    http.post('/api/test', body).subscribe();

    const req = httpTesting.expectOne('/api/test');
    expect(req.request.body).toEqual(body);
    expect(req.request.headers.has('X-Encrypted-Data')).toBe(false);
    req.flush(body);

    expect(mockAdapter.encrypt).not.toHaveBeenCalled();
    expect(mockAdapter.decrypt).not.toHaveBeenCalled();
  });

  it('should skip encryption if disabled via context', () => {
    configureTestBed();
    const body = { data: 123 };
    http
      .post('/api/test', body, {
        context: useEncryption({ encryptRequest: false }),
      })
      .subscribe();

    const req = httpTesting.expectOne('/api/test');
    expect(req.request.body).toEqual(body);
    expect(mockAdapter.encrypt).not.toHaveBeenCalled();
    req.flush({});
  });

  it('should skip decryption if disabled via context', () => {
    configureTestBed();
    const body = `encrypted:${JSON.stringify({ data: 123 })}`;
    let responseData: any;
    http
      .get('/api/test', {
        context: useEncryption({ decryptResponse: false }),
      })
      .subscribe(res => (responseData = res));

    const req = httpTesting.expectOne('/api/test');
    req.flush(body);

    expect(responseData).toBe(body);
    expect(mockAdapter.decrypt).not.toHaveBeenCalled();
  });

  it('should handle null bodies gracefully', () => {
    configureTestBed();
    http.get('/api/test').subscribe();

    const req = httpTesting.expectOne('/api/test');
    expect(req.request.body).toBeNull();
    req.flush(null);

    expect(mockAdapter.encrypt).not.toHaveBeenCalled();
    expect(mockAdapter.decrypt).not.toHaveBeenCalled();
  });

  it('should throw error if adapter is not provided', () => {
    expect(() => withEncryptionInterceptor({} as any)).toThrow(
      '[NgxOneforall - EncryptionInterceptor]: Encryption adapter is required'
    );
  });

  describe('Error Handling', () => {
    it('should throw on encryption error by default', () => {
      configureTestBed();
      mockAdapter.encrypt.mockImplementation(() => {
        throw new Error('Encryption failed');
      });

      let errorThrown: unknown = null;
      http.post('/api/test', { data: 123 }).subscribe({
        error: err => (errorThrown = err),
      });

      expect((errorThrown as Error)?.message).toBe('Encryption failed');
    });

    it('should not throw on encryption error when throwOnEncryptionError is false', () => {
      configureTestBed({ throwOnEncryptionError: false });
      mockAdapter.encrypt.mockImplementation(() => {
        throw new Error('Encryption failed');
      });

      const body = { data: 123 };
      http.post('/api/test', body).subscribe();

      const req = httpTesting.expectOne('/api/test');
      expect(req.request.body).toEqual(body); // Original unencrypted body
      req.flush({});
    });

    it('should throw on decryption error by default', () => {
      configureTestBed();
      mockAdapter.decrypt.mockImplementation(() => {
        throw new Error('Decryption failed');
      });

      let errorThrown = false;
      http.get('/api/test').subscribe({
        error: () => (errorThrown = true),
      });

      const req = httpTesting.expectOne('/api/test');
      req.flush('encrypted:{}');

      expect(errorThrown).toBe(true);
    });

    it('should not throw on decryption error when throwOnDecryptionError is false', () => {
      configureTestBed({ throwOnDecryptionError: false });
      mockAdapter.decrypt.mockImplementation(() => {
        throw new Error('Decryption failed');
      });

      let responseData: any;
      const encryptedBody = 'encrypted:{}';
      http.get('/api/test').subscribe(res => (responseData = res));

      const req = httpTesting.expectOne('/api/test');
      req.flush(encryptedBody);

      expect(responseData).toBe(encryptedBody); // Original encrypted body
    });
  });

  describe('useEncryption', () => {
    it('should create context with default values', () => {
      const context = useEncryption();
      expect(context.get(ENCRYPTION_CONTEXT)).toEqual({
        enabled: true,
        encryptRequest: true,
        decryptResponse: true,
      });
    });

    it('should allow overriding specific options', () => {
      const context = useEncryption({ encryptRequest: false });
      expect(context.get(ENCRYPTION_CONTEXT)).toEqual({
        enabled: true,
        encryptRequest: false,
        decryptResponse: true,
      });
    });

    it('should use provided context', () => {
      const existingContext = new HttpContext();
      const context = useEncryption({
        context: existingContext,
        decryptResponse: false,
      });
      expect(context).toBe(existingContext);
      expect(context.get(ENCRYPTION_CONTEXT)).toEqual({
        enabled: true,
        encryptRequest: true,
        decryptResponse: false,
      });
    });
  });
});
