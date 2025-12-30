/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
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
import { withTimeoutInterceptor } from './timeout.interceptor';
import { TIMEOUT_CONTEXT } from './timeout-context';

describe('withTimeoutInterceptor', () => {
  let httpTesting: HttpTestingController;
  let http: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([withTimeoutInterceptor(100)])),
        provideHttpClientTesting(),
      ],
    });

    http = TestBed.inject(HttpClient);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should complete before timeout', () => {
    let response: any;
    http.get('/api/test').subscribe(res => (response = res));

    const req = httpTesting.expectOne('/api/test');
    req.flush({ data: 'ok' });

    expect(response).toEqual({ data: 'ok' });
  });

  it('should timeout after 100ms by default', fakeAsync(() => {
    let errorResponse: any;
    http.get('/api/test').subscribe({
      next: () => fail('Should have timed out'),
      error: err => (errorResponse = err),
    });

    const req = httpTesting.expectOne('/api/test');

    // Move time forward by 101ms
    tick(101);

    expect(errorResponse).toBeDefined();
    expect(errorResponse.name).toBe('TimeoutError');
    expect(errorResponse.message).toBe('Request timed out after 100ms');
  }));

  it('should override timeout using TIMEOUT_CONTEXT', fakeAsync(() => {
    let errorResponse: any;
    const context = new HttpContext().set(TIMEOUT_CONTEXT, 50);

    http.get('/api/test', { context }).subscribe({
      next: () => fail('Should have timed out'),
      error: err => (errorResponse = err),
    });

    const req = httpTesting.expectOne('/api/test');

    // Default is 100ms, but context says 50ms.
    tick(51);

    expect(errorResponse).toBeDefined();
    expect(errorResponse.message).toBe('Request timed out after 50ms');
  }));

  it('should pass through other errors (line 22)', () => {
    let errorResponse: any;
    http.get('/api/test').subscribe({
      next: () => fail('Should have failed with 500'),
      error: err => (errorResponse = err),
    });

    const req = httpTesting.expectOne('/api/test');
    req.flush('Error', { status: 500, statusText: 'Internal Server Error' });

    expect(errorResponse).toBeDefined();
    expect(errorResponse.status).toBe(500);
  });
});
