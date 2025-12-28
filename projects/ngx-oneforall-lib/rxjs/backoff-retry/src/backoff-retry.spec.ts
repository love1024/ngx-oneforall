import { Observable, of } from 'rxjs';
import { backOffRetry } from './backoff-retry';
import { TestScheduler } from 'rxjs/testing';

describe('backOffRetry', () => {
  let testScheduler: TestScheduler;

  beforeEach(() => {
    testScheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected);
    });
  });

  it('should emit values without retry if no error occurs', () => {
    testScheduler.run(({ expectObservable }) => {
      const source$ = of(1, 2, 3).pipe(backOffRetry());
      expectObservable(source$).toBe('(abc|)', { a: 1, b: 2, c: 3 });
    });
  });

  it('should retry the specified number of times with exponential backoff', () => {
    testScheduler.run(({ expectObservable }) => {
      // Emit errors
      const customSource$ = new Observable<number>(subscriber => {
        subscriber.error('error');
      });

      const expected = '2s 4s 8s #'; // 3 retries, then error

      expectObservable(customSource$.pipe(backOffRetry())).toBe(
        expected,
        undefined,
        'error'
      );
    });
  });

  it('should succeed if a retry emits a value', () => {
    testScheduler.run(({ expectObservable }) => {
      // First attempt errors, second attempt emits value
      let subscribeCount = 0;
      const customSource$ = new Observable<number>(subscriber => {
        subscribeCount++;
        if (subscribeCount === 1) {
          subscriber.error('err1');
        } else {
          subscriber.next(42);
          subscriber.complete();
        }
      });

      expectObservable(customSource$.pipe(backOffRetry())).toBe('2s (a|)', {
        a: 42,
      });
    });
  });

  it('should use custom config for count and delay', () => {
    testScheduler.run(({ expectObservable }) => {
      const config = { count: 2, delay: 1000, base: 3 };
      // Emit errors
      const customSource$ = new Observable<number>(subscriber => {
        subscriber.error('error');
      });

      const expected = '3s 9s #'; // 3 retries, then error

      expectObservable(customSource$.pipe(backOffRetry(config))).toBe(expected);
    });
  });
});
