import { TestBed } from '@angular/core/testing';
import { PLATFORM_ID } from '@angular/core';
import { CookieService, CookieOptions } from './cookie.service';

describe('CookieService', () => {
  let service: CookieService;
  let originalCookie: PropertyDescriptor;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CookieService],
    });
    service = TestBed.inject(CookieService);
    originalCookie = Object.getOwnPropertyDescriptor(document, 'cookie')!;
    let cookieStore = '';
    Object.defineProperty(document, 'cookie', {
      get: () => cookieStore,
      set: (val: string) => {
        // Simulate browser cookie behavior: append or replace
        const match = /^([^=]+)=([^;]*)/.exec(val);
        if (match) {
          const name = match[1];
          const value = match[2];
          const cookies = cookieStore
            .split(';')
            .map(c => c.trim())
            .filter(Boolean)
            .reduce(
              (acc, c) => {
                const [n, v] = c.split('=');
                acc[n] = v;
                return acc;
              },
              {} as Record<string, string>
            );
          cookies[name] = value;
          cookieStore = Object.entries(cookies)
            .map(([n, v]) => `${n}=${v}`)
            .join('; ');
        } else {
          cookieStore = val;
        }
      },
      configurable: true,
    });
  });

  afterEach(() => {
    if (originalCookie) {
      Object.defineProperty(document, 'cookie', originalCookie);
    }
  });

  it('should set and get a cookie', () => {
    service.set('foo', 'bar');
    expect(service.get('foo')).toBe('bar');
  });

  it('should encode and decode cookie names and values', () => {
    service.set('na me', 'va=lue', { domain: 'test', partitioned: true });
    expect(service.get('na me')).toBe('va=lue');
  });

  it('should get all cookies', () => {
    service.set('a', '1');
    service.set('b', '2');
    expect(service.getAll()).toEqual({ a: '1', b: '2' });
  });

  it('should delete a cookie', () => {
    service.set('foo', 'bar');
    service.delete('foo');
    expect(service.get('foo')).toBe('');
  });

  it('should delete all cookies', () => {
    service.set('a', '1');
    service.set('b', '2');
    service.deleteAll();
    expect(service.get('a')).toBe('');
    expect(service.get('b')).toBe('');
  });

  it('should merge default cookie options', () => {
    const opts: CookieOptions = { path: '/test', sameSite: 'Strict' };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const merged = (service as any).mergeDefaultCookieOptions(opts);
    expect(merged.sameSite).toBe('Strict');
    expect(merged.path).toBe('/test');
  });

  it('should handle secure flag when SameSite=None', () => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    service.set('foo', 'bar', { sameSite: 'None', secure: false });
    expect(warnSpy).toHaveBeenCalled();
  });

  it('should handle expiry as number', () => {
    const opts: CookieOptions = { expires: 60 };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const expiry = (service as any).getExpiryTime(opts.expires);

    expect(typeof expiry).toBe('string');
    expect(expiry).toMatch(/GMT$/);
  });

  it('should handle expiry as Date', () => {
    const date = new Date();
    const opts: CookieOptions = { expires: date };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const expiry = (service as any).getExpiryTime(opts.expires);
    expect(expiry).toBe(date.toUTCString());
  });

  it('should safely decode URI components', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((service as any).safeDecodeURIComponent('%E0%A4%A')).toBe(
      '%E0%A4%A'
    );
    expect(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (service as any).safeDecodeURIComponent(encodeURIComponent('abc'))
    ).toBe('abc');
  });

  it('should escape cookie name in regex', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const regex = (service as any).getCookieUsingRegex('na.me');
    expect(regex).toBeInstanceOf(RegExp);
    expect('na.me=val;'.match(regex)).not.toBeNull();
  });
});

describe('CookieService - SSR', () => {
  let service: CookieService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CookieService, { provide: PLATFORM_ID, useValue: 'server' }],
    });
    service = TestBed.inject(CookieService);
  });

  it('should return empty string for get() on server', () => {
    expect(service.get('foo')).toBe('');
  });

  it('should return empty object for getAll() on server', () => {
    expect(service.getAll()).toEqual({});
  });

  it('should not throw for set() on server', () => {
    expect(() => service.set('foo', 'bar')).not.toThrow();
  });

  it('should not throw for delete() on server', () => {
    expect(() => service.delete('foo')).not.toThrow();
  });

  it('should not throw for deleteAll() on server', () => {
    expect(() => service.deleteAll()).not.toThrow();
  });
});
