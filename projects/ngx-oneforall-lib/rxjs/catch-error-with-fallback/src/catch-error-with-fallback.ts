import { isFunction } from 'ngx-oneforall/utils/find-type';
import {
  catchError,
  isObservable,
  Observable,
  of,
  OperatorFunction,
} from 'rxjs';

/**
 * Options for the `catchErrorWithFallback` operator.
 */
export interface CatchErrorWithFallbackOptions {
  /**
   * Callback function executed when an error occurs.
   * Useful for logging or side effects before the fallback is applied.
   */
  onError?: (error: unknown) => void;
}

/**
 * Defines what can be used as a fallback.
 * - A static value of type T
 * - An Observable that emits T
 * - A factory function that receives the error and returns T or Observable<T>
 */
export type FallbackFactory<T> =
  | T
  | Observable<T>
  | ((error: unknown) => T | Observable<T>);

/**
 * RxJS operator that catches errors on the source observable and returns a fallback value or observable.
 * Provides flexibility in error handling by supporting static values, observables, or dynamic factory functions.
 *
 * @param fallback - The value, observable, or factory function to use when an error occurs.
 * @param options - Configuration options, including an `onError` callback for side effects.
 * @returns An OperatorFunction that emits the fallback in case of an error.
 *
 * @example
 * // Fallback to a static value
 * source$.pipe(catchErrorWithFallback('fallback value'));
 *
 * @example
 * // Fallback to an Observable
 * source$.pipe(catchErrorWithFallback(of('fallback observable')));
 *
 * @example
 * // Fallback using a factory function
 * source$.pipe(
 *   catchErrorWithFallback((err) => {
 *      console.error(err);
 *      return 'dynamic fallback';
 *   })
 * );
 *
 * @example
 * // Using options for side effects
 * source$.pipe(
 *   catchErrorWithFallback('safe value', {
 *     onError: (err) => console.error('Error occurred:', err)
 *   })
 * );
 */
export function catchErrorWithFallback<T>(
  fallback: FallbackFactory<T>,
  options: CatchErrorWithFallbackOptions = {}
): OperatorFunction<T, T> {
  const { onError } = options;

  return (source$: Observable<T>): Observable<T> =>
    source$.pipe(
      catchError((error: unknown): Observable<T> => {
        onError?.(error);

        if (isFunction(fallback)) {
          const result = (fallback as (e: unknown) => T | Observable<T>)(error);
          return (isObservable(result) ? result : of(result)) as Observable<T>;
        }

        return (
          isObservable(fallback) ? fallback : of(fallback)
        ) as Observable<T>;
      })
    );
}
