import { TestBed } from '@angular/core/testing';
import {
  Router,
  ActivatedRouteSnapshot,
  RedirectCommand,
} from '@angular/router';
import { paramGuard, ParamGuardConfig } from './param.guard';
import { EnvironmentInjector, runInInjectionContext } from '@angular/core';

describe('paramGuard', () => {
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: Router,
          useValue: {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            parseUrl: jest.fn((url: string) => url as any),
          },
        },
      ],
    });
    router = TestBed.inject(Router);
  });

  const getGuardResult = (
    config: ParamGuardConfig,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    params: any
  ) => {
    const environment = TestBed.inject(EnvironmentInjector);
    return runInInjectionContext(environment, () => {
      const guard = paramGuard(config);
      const route = { params } as ActivatedRouteSnapshot;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (guard as any)(route, {} as any);
    });
  };

  it('should allow activation when no configuration is provided', () => {
    const result = getGuardResult({}, {});
    expect(result).toBe(true);
  });

  it('should allow activation when required parameters are present', () => {
    const result = getGuardResult({ required: ['id'] }, { id: '123' });
    expect(result).toBe(true);
  });

  it('should deny activation when required parameters are missing', () => {
    const result = getGuardResult({ required: ['id'] }, {});
    expect(result).toBe(false);
  });

  it('should redirect when required parameters are missing and redirectTo is provided', () => {
    const result = getGuardResult(
      { required: ['id'], redirectTo: '/login' },
      {}
    );
    expect(result).toBeInstanceOf(RedirectCommand);
    expect(router.parseUrl).toHaveBeenCalledWith('/login');
  });

  it('should allow activation when predicate returns true', () => {
    const result = getGuardResult(
      { predicate: params => params['type'] === 'admin' },
      { type: 'admin' }
    );
    expect(result).toBe(true);
  });

  it('should deny activation when predicate returns false', () => {
    const result = getGuardResult(
      { predicate: params => params['type'] === 'admin' },
      { type: 'user' }
    );
    expect(result).toBe(false);
  });

  it('should redirect when predicate returns false and redirectTo is provided', () => {
    const result = getGuardResult(
      {
        predicate: params => params['type'] === 'admin',
        redirectTo: '/unauthorized',
      },
      { type: 'user' }
    );
    expect(result).toBeInstanceOf(RedirectCommand);
    expect(router.parseUrl).toHaveBeenCalledWith('/unauthorized');
  });

  it('should handle empty or null values for required parameters as missing', () => {
    expect(getGuardResult({ required: ['id'] }, { id: '' })).toBe(false);
    expect(getGuardResult({ required: ['id'] }, { id: null })).toBe(false);
    expect(getGuardResult({ required: ['id'] }, { id: undefined })).toBe(false);
  });

  it('should handle missing params in route', () => {
    const environment = TestBed.inject(EnvironmentInjector);
    const result = runInInjectionContext(environment, () => {
      const guard = paramGuard({ required: ['id'] });
      // route with empty params
      const route = { params: {} } as ActivatedRouteSnapshot;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (guard as any)(route, {} as any);
    });
    expect(result).toBe(false);
  });
});
