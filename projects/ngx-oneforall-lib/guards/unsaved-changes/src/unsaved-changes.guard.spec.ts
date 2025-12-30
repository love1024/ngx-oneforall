import { TestBed } from '@angular/core/testing';
import { DOCUMENT } from '@angular/common';
import { isObservable, lastValueFrom, Observable, of } from 'rxjs';
import { unsavedChangesGuard } from './unsaved-changes.guard';
import { EnvironmentInjector, runInInjectionContext } from '@angular/core';

describe('unsavedChangesGuard', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockWindow: any;

  beforeEach(() => {
    mockWindow = { confirm: jest.fn() };
    TestBed.configureTestingModule({
      providers: [{ provide: DOCUMENT, useValue: { defaultView: mockWindow } }],
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should return true if window or window.confirm is not available', done => {
    TestBed.overrideProvider(DOCUMENT, { useValue: { defaultView: null } });
    const environment = TestBed.inject(EnvironmentInjector);
    runInInjectionContext(environment, async () => {
      const guard = unsavedChangesGuard();
      const result = guard(
        { hasUnsavedChanges: () => true },
        {} as any,
        {} as any,
        {} as any
      );
      expect(result).toBe(true);
      done();
    });
  });

  it('should call window.confirm if hasUnsavedChanges returns true (boolean)', done => {
    mockWindow.confirm.mockReturnValueOnce(false);

    const environment = TestBed.inject(EnvironmentInjector);
    runInInjectionContext(environment, async () => {
      const guard = unsavedChangesGuard('Leave?');
      const result = guard(
        { hasUnsavedChanges: () => true },
        {} as any,
        {} as any,
        {} as any
      );
      expect(mockWindow.confirm).toHaveBeenCalledWith('Leave?');
      expect(result).toBe(false);
      done();
    });
  });

  it('should return true if hasUnsavedChanges returns false (boolean)', done => {
    const environment = TestBed.inject(EnvironmentInjector);
    runInInjectionContext(environment, async () => {
      const guard = unsavedChangesGuard();
      const result = guard(
        { hasUnsavedChanges: () => false },
        {} as any,
        {} as any,
        {} as any
      );
      expect(result).toBe(true);
      done();
    });
  });

  it('should handle Observable<boolean> result', done => {
    mockWindow.confirm.mockReturnValueOnce(true);
    const environment = TestBed.inject(EnvironmentInjector);
    runInInjectionContext(environment, async () => {
      const guard = unsavedChangesGuard('Leave?');
      const result$ = guard(
        {
          hasUnsavedChanges: () => of(true),
        },
        {} as any,
        {} as any,
        {} as any
      );

      let result: boolean;
      if (isObservable(result$)) {
        result = await lastValueFrom(result$ as Observable<boolean>);
      } else {
        result = result$ as boolean;
      }

      expect(mockWindow.confirm).toHaveBeenCalledWith('Leave?');
      expect(result).toBe(true);
      done();
    });
  });

  it('should handle Promise<boolean> result', done => {
    mockWindow.confirm.mockReturnValueOnce(false);

    const environment = TestBed.inject(EnvironmentInjector);
    runInInjectionContext(environment, async () => {
      const guard = unsavedChangesGuard('Leave?');
      const result = await guard(
        {
          hasUnsavedChanges: () => Promise.resolve(true),
        },
        {} as any,
        {} as any,
        {} as any
      );
      expect(mockWindow.confirm).toHaveBeenCalledWith('Leave?');
      expect(result).toBe(false);
      done();
    });
  });

  it('should return true if Observable/Promise resolves to false', done => {
    const environment = TestBed.inject(EnvironmentInjector);
    runInInjectionContext(environment, async () => {
      const guard = unsavedChangesGuard();

      // Observable case - Call guard synchronously
      const retObs = guard(
        {
          hasUnsavedChanges: () => of(false),
        },
        {} as any,
        {} as any,
        {} as any
      );

      // Promise case - Call guard synchronously (while still in injection context)
      const retProm = guard(
        {
          hasUnsavedChanges: () => Promise.resolve(false),
        },
        {} as any,
        {} as any,
        {} as any
      );

      // Now handle results
      let resultObs: boolean;
      if (isObservable(retObs)) {
        resultObs = await lastValueFrom(retObs as Observable<boolean>);
      } else {
        resultObs = retObs as boolean;
      }

      // Handle Promise result
      const resultProm = await retProm;

      expect(resultObs).toBe(true);
      expect(resultProm).toBe(true);
      done();
    });
  });
});
