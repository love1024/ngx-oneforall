import { isPlatformBrowser } from '@angular/common';
import { HttpInterceptorFn } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';
import {
  CORRELATION_ID_CONTEXT,
  CorrelationIdContextConfig,
} from './correlation-id-context';

/**
 * Configuration for the correlation ID interceptor.
 */
export interface CorrelationIdConfig {
  /** Custom header name for the correlation ID. Defaults to `X-Correlation-Id`. */
  header?: string;
  /** Custom function to generate unique correlation IDs. */
  idGenerator?: () => string;
}

/**
 * Default correlation ID generator.
 * Uses `crypto.randomUUID()` if available, otherwise falls back to a timestamp-based ID.
 */
const defaultCorrelationIdGenerator = (): string => {
  return (
    crypto.randomUUID?.() ??
    `${Date.now()}-${Math.random().toString(16).slice(2)}`
  );
};

const HEADER_NAME = 'X-Correlation-Id';

/**
 * Creates an HTTP interceptor that adds a unique correlation ID header to each request.
 * Enables request tracking, debugging, and distributed tracing across services.
 *
 * @param config - Optional configuration for header name and ID generation
 * @returns An Angular HTTP interceptor function
 *
 * @example
 * ```typescript
 * // Basic usage with defaults
 * provideHttpClient(
 *   withInterceptors([withCorrelationIdInterceptor()])
 * );
 *
 * // Custom header name
 * withCorrelationIdInterceptor({ header: 'X-Request-Id' });
 *
 * // Custom ID generator
 * withCorrelationIdInterceptor({
 *   idGenerator: () => `req-${Date.now()}`
 * });
 * ```
 *
 * @remarks
 * - Only operates in browser environments (skips SSR).
 * - Existing correlation ID headers are not overridden.
 * - Per-request behavior can be controlled via `CORRELATION_ID_CONTEXT`.
 */
export function withCorrelationIdInterceptor(config?: CorrelationIdConfig) {
  const { header = HEADER_NAME, idGenerator = defaultCorrelationIdGenerator } =
    config || {};
  const correlationIdInterceptor: HttpInterceptorFn = (req, next) => {
    const platformId = inject(PLATFORM_ID);

    if (!isPlatformBrowser(platformId)) {
      return next(req);
    }

    const contextConfig: CorrelationIdContextConfig | null = req.context.get(
      CORRELATION_ID_CONTEXT
    );

    // Explicitly disabled via context
    if (contextConfig?.enabled === false) {
      return next(req);
    }

    // If already present, do not override
    if (req.headers.has(header)) {
      return next(req);
    }

    const correlationId = contextConfig?.id ?? idGenerator();

    return next(
      req.clone({
        setHeaders: {
          [header]: correlationId,
        },
      })
    );
  };

  return correlationIdInterceptor;
}
