/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { catchErrorWithFallback } from './catch-error-with-fallback';
import { of, throwError, Observable } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';

describe('catchErrorWithFallback', () => {
  let testScheduler: TestScheduler;

  beforeEach(() => {
    testScheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected);
    });
  });

  it('should pass through values when no error occurs', () => {
    testScheduler.run(({ cold, expectObservable }) => {
      const source$ = cold('-a-b-c-|', { a: 1, b: 2, c: 3 });
      const result$ = source$.pipe(catchErrorWithFallback(0));

      expectObservable(result$).toBe('-a-b-c-|', { a: 1, b: 2, c: 3 });
    });
  });

  it('should return a static fallback value on error', () => {
    testScheduler.run(({ cold, expectObservable }) => {
      const source$ = cold('-a-#', { a: 1 });
      const result$ = source$.pipe(catchErrorWithFallback(999));

      expectObservable(result$).toBe('-a-(b|)', { a: 1, b: 999 });
    });
  });

  it('should return an observable fallback on error', () => {
    testScheduler.run(({ cold, expectObservable }) => {
      const source$ = cold('-a-#', { a: 1 });
      const fallback$ = of(888);
      const result$ = source$.pipe(catchErrorWithFallback(fallback$));

      expectObservable(result$).toBe('-a-(b|)', { a: 1, b: 888 });
    });
  });

  it('should use a factory function returning a static value', () => {
    testScheduler.run(({ cold, expectObservable }) => {
      const source$ = cold('-a-#', { a: 1 });
      const result$ = source$.pipe(catchErrorWithFallback(err => 777));

      expectObservable(result$).toBe('-a-(b|)', { a: 1, b: 777 });
    });
  });

  it('should use a factory function returning an observable', () => {
    testScheduler.run(({ cold, expectObservable }) => {
      const source$ = cold('-a-#', { a: 1 });
      const result$ = source$.pipe(catchErrorWithFallback(err => of(666)));

      expectObservable(result$).toBe('-a-(b|)', { a: 1, b: 666 });
    });
  });

  it('should call onError callback when an error occurs', () => {
    const onError = jest.fn();
    testScheduler.run(({ cold, expectObservable }) => {
      const error = new Error('test error');
      const source$ = cold('-a-#', { a: 1 }, error);
      const result$ = source$.pipe(catchErrorWithFallback(0, { onError }));

      expectObservable(result$).toBe('-a-(b|)', { a: 1, b: 0 });
    });
    expect(onError).toHaveBeenCalledWith(new Error('test error'));
  });

  it('should handle complex result types', () => {
    testScheduler.run(({ cold, expectObservable }) => {
      const source$ = cold('-a-#', { a: { val: 1 } });
      const fallback = { val: 0 };
      const result$ = source$.pipe(catchErrorWithFallback(fallback));

      expectObservable(result$).toBe('-a-(b|)', {
        a: { val: 1 },
        b: { val: 0 },
      });
    });
  });

  it(' should pass the error to the factory function', () => {
    const factory = jest.fn((err: any) => err.message);
    testScheduler.run(({ cold, expectObservable }) => {
      const error = new Error('custom error');
      const source$ = cold('-#', {}, error);
      const result$ = source$.pipe(catchErrorWithFallback(factory));

      expectObservable(result$).toBe('-(a|)', { a: 'custom error' });
    });
    expect(factory).toHaveBeenCalledWith(new Error('custom error'));
  });
});
