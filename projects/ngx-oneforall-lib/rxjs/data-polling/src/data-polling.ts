import { OperatorFunction, Observable, timer, retry } from 'rxjs';
import { switchMap } from 'rxjs/operators';

/**
 * Configuration for the dataPolling operator.
 */
export interface DataPollingConfig<T> {
  /** Function that returns an Observable to call on each poll. */
  loader: () => Observable<T>;
  /** Polling interval in milliseconds. */
  interval: number;
  /** Number of retry attempts on error. Default is 0 (no retry). */
  retryCount?: number;
  /** Delay between retries in milliseconds. Default is 1000. */
  retryDelay?: number;
}

/**
 * RxJS operator that polls for data at a specified interval.
 * Supports configurable retry behavior on errors.
 *
 * @param config - Configuration object containing the loader function, polling interval, and optional retry settings.
 * @returns Operator function that emits the result of the loader function.
 *
 * @example
 * source$.pipe(
 *   dataPolling({
 *     loader: () => http.get('/api/data'),
 *     interval: 5000, // Poll every 5 seconds
 *     retryCount: 3,  // Retry up to 3 times on error
 *     retryDelay: 1000 // Wait 1 second between retries
 *   })
 * )
 */
export function dataPolling<T>(
  config: DataPollingConfig<T>
): OperatorFunction<unknown, T> {
  const { loader, interval, retryCount = 0, retryDelay = 1000 } = config;

  return source =>
    source.pipe(
      switchMap(() =>
        timer(0, interval).pipe(
          switchMap(() =>
            loader().pipe(retry({ count: retryCount, delay: retryDelay }))
          )
        )
      )
    );
}
