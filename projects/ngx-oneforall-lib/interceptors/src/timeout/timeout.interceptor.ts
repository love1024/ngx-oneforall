import { isPlatformServer } from '@angular/common';
import { HttpInterceptorFn } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';
import { timeout, catchError, throwError, TimeoutError } from 'rxjs';
import { TIMEOUT_CONTEXT } from './timeout-context';

export const TIMEOUT_ERROR = 'TimeoutError';

/**
 * Interceptor that adds a timeout to every HTTP request.
 *
 * @param timeoutMs The timeout duration in milliseconds.
 * @returns An HttpInterceptorFn.
 */
export function withTimeoutInterceptor(timeoutMs: number) {
  const timeoutInterceptor: HttpInterceptorFn = (req, next) => {
    // Give preference to timeout from context
    const timeoutFromContext = req.context.get(TIMEOUT_CONTEXT);
    if (timeoutFromContext) {
      timeoutMs = timeoutFromContext;
    }

    return next(req).pipe(
      timeout(timeoutMs),
      catchError(error => {
        if (error instanceof TimeoutError) {
          return throwError(() => ({
            name: TIMEOUT_ERROR,
            message: `Request timed out after ${timeoutMs}ms`,
            request: req,
          }));
        }
        return throwError(() => error);
      })
    );
  };
  return timeoutInterceptor;
}
