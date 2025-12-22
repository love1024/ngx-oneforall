import { isFunction } from '@ngx-oneforall/utils';
import { catchError, isObservable, Observable, of } from 'rxjs';

export interface CatchErrorWithFallbackOptions {
  onError?: (error: unknown) => void;
}

export type FallbackFactory<T> =
  | T
  | Observable<T>
  | ((error: unknown) => T | Observable<T>);

export function catchErrorWithFallback<T>(
  fallback: FallbackFactory<T>,
  options: CatchErrorWithFallbackOptions = {}
) {
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
