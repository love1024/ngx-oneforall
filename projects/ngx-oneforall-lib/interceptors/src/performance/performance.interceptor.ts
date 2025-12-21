import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import {
  PERFORMANCE_CONTEXT,
  PerformanceContextConfig,
} from './performance-context';
import { catchError, tap, throwError } from 'rxjs';
import {
  EnvironmentInjector,
  inject,
  runInInjectionContext,
} from '@angular/core';

export interface PerformanceEntry {
  url: string;
  method: string;
  durationMs: number;
  status?: number;
  label?: string;
}

export interface PerformanceInterceptorConfig {
  enabled?: boolean;
  reporter?: (entry: PerformanceEntry) => void;
}

export const defaultPerformanceReporter = (entry: PerformanceEntry) => {
  console.debug('[HTTP Performance]', entry);
};

export const withPerformanceInterceptor = (
  config: PerformanceInterceptorConfig
) => {
  const { reporter = defaultPerformanceReporter, enabled = true } = config;

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

    const start = performance.now();
    const label = contextConfig?.label;

    return next(request).pipe(
      tap({
        next: event => {
          if (event instanceof HttpResponse) {
            report({
              url: request.url,
              method: request.method,
              durationMs: performance.now() - start,
              status: event.status,
              label,
            });
          }
        },
      }),
      catchError(error => {
        report({
          url: request.url,
          method: request.method,
          durationMs: performance.now() - start,
          status: error?.status,
          label,
        });
        return throwError(() => error);
      })
    );
  };

  return performanceInterceptor;
};
