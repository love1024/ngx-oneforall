import {
  catchError,
  map,
  Observable,
  of,
  OperatorFunction,
  startWith,
} from 'rxjs';

/**
 * Represents the result of an async resource operation.
 */
export interface ResourceResult<T> {
  isLoading: boolean;
  status: 'loading' | 'success' | 'error';
  data: T | null;
  error?: unknown;
}

/**
 * RxJS operator that tracks the loading state of an observable.
 * It transforms the source observable into a stream of `ResourceResult` objects,
 * emitting a loading state initially, followed by the success data or error result.
 *
 * @returns Operator function that wraps the source value in a `ResourceResult`.
 *
 * @example
 * source$.pipe(loadingStatus())
 */
export function loadingStatus<T>(): OperatorFunction<T, ResourceResult<T>> {
  return (source: Observable<T>) => {
    return source.pipe(
      map(data => ({
        status: 'success' as const,
        data,
        error: null,
      })),
      startWith({
        status: 'loading' as const,
        data: null,
        error: null,
      }),
      catchError(error =>
        of({
          status: 'error' as const,
          error,
          data: null,
        })
      ),
      map(
        result =>
          ({
            ...result,
            isLoading: result.status === 'loading',
          }) satisfies ResourceResult<T>
      )
    );
  };
}
