import { OperatorFunction, Observable, timer } from 'rxjs';
import { switchMap } from 'rxjs/operators';

export interface DataPollingConfig<T> {
  loader: () => Observable<T>;
  interval: number;
}

/**
 * RxJS operator that polls for data at a specified interval.
 *
 * @param config - Configuration object containing the loader function and polling interval.
 * @returns Operator function that emits the result of the loader function.
 *
 * @example
 * source$.pipe(
 *   dataPolling({
 *     loader: () => http.get('/api/data'),
 *     interval: 5000 // Poll every 5 seconds
 *   })
 * )
 */
export function dataPolling<T>(
  config: DataPollingConfig<T>
): OperatorFunction<unknown, T> {
  return source =>
    source.pipe(
      switchMap(() => timer(0, config.interval).pipe(switchMap(config.loader)))
    );
}
