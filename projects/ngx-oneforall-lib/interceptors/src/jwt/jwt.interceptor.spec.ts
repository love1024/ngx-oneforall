import { TestBed } from '@angular/core/testing';
import {
  HttpClient,
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { jwtInterceptor } from './jwt.interceptor';
import { JwtService, provideJwtService } from '@ngx-oneforall/services';

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

  it('should skip if request domain is not in includedDomains', () => {
    mockJwtService.getConfig.mockReturnValue({
      includedDomains: ['allowed.com'],
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
      excludedRoutes: ['https://example.com/api/auth'],
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
      includedDomains: ['http://gatherbits.com'],
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
      includedDomains: [/gatherbits.com/],
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
      includedDomains: ['localhost:3000'],
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
      excludedRoutes: [/localhost:3000/],
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
});
