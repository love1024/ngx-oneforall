import { HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { timeout, catchError, throwError, TimeoutError } from 'rxjs';
import { TIMEOUT_CONTEXT } from './timeout-context';

/**
 * Error name constant for timeout errors.
 * Use this to identify timeout errors in error handlers.
 */
export const TIMEOUT_ERROR = 'TimeoutError';

/**
 * Timeout error structure returned when a request times out.
 */
export interface TimeoutErrorInfo {
  /** Error name, always `'TimeoutError'` */
  name: typeof TIMEOUT_ERROR;
  /** Human-readable error message */
  message: string;
  /** The original request that timed out */
  request: HttpRequest<unknown>;
}

/**
 * Creates an HTTP interceptor that applies a timeout to all requests.
 *
 * @param timeoutMs - Default timeout duration in milliseconds
 * @returns An Angular HTTP interceptor function
 *
 * @example
 * ```typescript
 * provideHttpClient(
 *   withInterceptors([
 *     withTimeoutInterceptor(30000) // 30 second default
 *   ])
 * );
 * ```
 *
 * @remarks
 * - Default timeout applies to all requests
 * - Per-request timeout via `TIMEOUT_CONTEXT` overrides the default
 * - On timeout, throws a `TimeoutErrorInfo` object
 * - Works with RxJS `timeout` operator
 */
export function withTimeoutInterceptor(timeoutMs: number) {
  const timeoutInterceptor: HttpInterceptorFn = (req, next) => {
    const timeoutFromContext = req.context.get(TIMEOUT_CONTEXT);
    const effectiveTimeout = timeoutFromContext || timeoutMs;

    return next(req).pipe(
      timeout(effectiveTimeout),
      catchError(error => {
        if (error instanceof TimeoutError) {
          return throwError(
            () =>
              ({
                name: TIMEOUT_ERROR,
                message: `Request timed out after ${effectiveTimeout}ms`,
                request: req,
              }) satisfies TimeoutErrorInfo
          );
        }
        return throwError(() => error);
      })
    );
  };
  return timeoutInterceptor;
}
