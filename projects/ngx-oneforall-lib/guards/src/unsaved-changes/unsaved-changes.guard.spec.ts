import { TestBed } from '@angular/core/testing';
import { DOCUMENT } from '@angular/common';
import { of } from 'rxjs';
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
    runInInjectionContext(environment, () => {
      const guard = unsavedChangesGuard();
      const result = guard({ hasUnsavedChanges: () => true });
      expect(result).toBe(true);
      done();
    });
  });

  it('should call window.confirm if hasUnsavedChanges returns true (boolean)', done => {
    mockWindow.confirm.mockReturnValueOnce(false);

    const environment = TestBed.inject(EnvironmentInjector);
    runInInjectionContext(environment, () => {
      const guard = unsavedChangesGuard('Leave?');
      const result = guard({ hasUnsavedChanges: () => true });
      expect(mockWindow.confirm).toHaveBeenCalledWith('Leave?');
      expect(result).toBe(false);
      done();
    });
  });

  it('should return true if hasUnsavedChanges returns false (boolean)', done => {
    const environment = TestBed.inject(EnvironmentInjector);
    runInInjectionContext(environment, () => {
      const guard = unsavedChangesGuard();
      const result = guard({ hasUnsavedChanges: () => false });
      expect(result).toBe(true);
      done();
    });
  });

  it('should handle Observable<boolean> result', done => {
    mockWindow.confirm.mockReturnValueOnce(true);
    const environment = TestBed.inject(EnvironmentInjector);
    runInInjectionContext(environment, async () => {
      const guard = unsavedChangesGuard('Leave?');
      const result = await guard({ hasUnsavedChanges: () => of(true) });
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
      const result = await guard({
        hasUnsavedChanges: () => Promise.resolve(true),
      });
      expect(mockWindow.confirm).toHaveBeenCalledWith('Leave?');
      expect(result).toBe(false);
      done();
    });
  });

  it('should return true if Observable/Promise resolves to false', done => {
    const environment = TestBed.inject(EnvironmentInjector);
    runInInjectionContext(environment, async () => {
      const guard = unsavedChangesGuard();
      const resultObs = await guard({ hasUnsavedChanges: () => of(false) });
      const resultProm = await guard({
        hasUnsavedChanges: () => Promise.resolve(false),
      });
      expect(resultObs).toBe(true);
      expect(resultProm).toBe(true);
      done();
    });
  });
});
