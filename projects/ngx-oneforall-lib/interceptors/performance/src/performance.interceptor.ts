import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import {
  PERFORMANCE_CONTEXT,
  PerformanceContextConfig,
} from './performance-context';
import { catchError, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import {
  EnvironmentInjector,
  inject,
  runInInjectionContext,
} from '@angular/core';

/**
 * Performance metrics for an HTTP request.
 */
export interface PerformanceEntry {
  /** Request URL */
  url: string;
  /** HTTP method (GET, POST, etc.) */
  method: string;
  /** Request duration in milliseconds */
  durationMs: number;
  /** HTTP status code (if available) */
  status?: number;
  /** Custom label for the request */
  label?: string;
  /** Whether the request exceeded the slow threshold */
  isSlow?: boolean;
}

/**
 * Configuration for the performance interceptor.
 */
export interface PerformanceInterceptorConfig {
  /** Enable/disable performance tracking. Default: true */
  enabled?: boolean;
  /** Custom reporter function. Default: console.debug */
  reporter?: (entry: PerformanceEntry) => void;
  /** Threshold in ms to mark requests as slow. Default: undefined (disabled) */
  slowThresholdMs?: number;
  /** Only report requests that exceed slowThresholdMs. Default: false */
  reportOnlyIfSlow?: boolean;
}

/**
 * Default reporter that logs performance entries to console.
 */
export const defaultPerformanceReporter = (entry: PerformanceEntry) => {
  const prefix = entry.isSlow
    ? '[HTTP Performance - SLOW]'
    : '[HTTP Performance]';
  console.debug(prefix, entry);
};

/**
 * Gets the current timestamp in milliseconds.
 * Falls back to Date.now() for SSR environments.
 */
const getTimestamp = (): number => {
  return typeof performance !== 'undefined' ? performance.now() : Date.now();
};

/**
 * Creates an HTTP interceptor that tracks request performance metrics.
 *
 * @param config - Performance interceptor configuration
 * @returns An Angular HTTP interceptor function
 *
 * @example
 * ```typescript
 * provideHttpClient(
 *   withInterceptors([
 *     withPerformanceInterceptor({
 *       slowThresholdMs: 2000,
 *       reporter: (entry) => analytics.track('http_request', entry)
 *     })
 *   ])
 * );
 * ```
 *
 * @remarks
 * - Tracks request duration for all HTTP requests
 * - Supports custom reporters for analytics integration
 * - Per-request control via `PERFORMANCE_CONTEXT`
 * - SSR-safe (uses Date.now() fallback)
 */
export const withPerformanceInterceptor = (
  config: PerformanceInterceptorConfig = {}
) => {
  const {
    reporter = defaultPerformanceReporter,
    enabled = true,
    slowThresholdMs,
    reportOnlyIfSlow = false,
  } = config;

  const performanceInterceptor: HttpInterceptorFn = (request, next) => {
    const injector = inject(EnvironmentInjector);

    const contextConfig: PerformanceContextConfig | null =
      request.context.get(PERFORMANCE_CONTEXT);

    if (contextConfig?.enabled === false || !enabled) {
      return next(request);
    }

    const report = (entry: PerformanceEntry) => {
      runInInjectionContext(injector, () => reporter(entry));
    };

    const start = getTimestamp();
    const label = contextConfig?.label;

    return next(request).pipe(
      tap({
        next: event => {
          if (event instanceof HttpResponse) {
            const durationMs = Math.round(getTimestamp() - start);
            const isSlow = slowThresholdMs
              ? durationMs > slowThresholdMs
              : false;

            if (reportOnlyIfSlow && !isSlow) {
              return;
            }

            report({
              url: request.url,
              method: request.method,
              durationMs,
              status: event.status,
              label,
              isSlow: slowThresholdMs ? isSlow : undefined,
            });
          }
        },
      }),
      catchError(error => {
        const durationMs = Math.round(getTimestamp() - start);
        const isSlow = slowThresholdMs ? durationMs > slowThresholdMs : false;

        if (!reportOnlyIfSlow || isSlow) {
          report({
            url: request.url,
            method: request.method,
            durationMs,
            status: error?.status,
            label,
            isSlow: slowThresholdMs ? isSlow : undefined,
          });
        }
        return throwError(() => error);
      })
    );
  };

  return performanceInterceptor;
};
