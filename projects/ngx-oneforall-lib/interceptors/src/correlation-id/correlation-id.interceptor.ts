import { isPlatformBrowser } from '@angular/common';
import { HttpInterceptorFn } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';
import {
  CORRELATION_ID_CONTEXT,
  CorrelationIdContextConfig,
} from './correlation-id-context';

export interface CorrelationIdConfig {
  header?: string;
  idGenerator?: () => string;
}

const defaultCorrelationIdGenerator = (): string => {
  return (
    crypto.randomUUID?.() ??
    `${Date.now()}-${Math.random().toString(16).slice(2)}`
  );
};

const HEADER_NAME = 'X-Correlation-Id';

export function withCorrelationIdInterceptor(config?: CorrelationIdConfig) {
  const { header = HEADER_NAME, idGenerator = defaultCorrelationIdGenerator } =
    config || {};
  const correlationIdInterceptor: HttpInterceptorFn = (req, next) => {
    const platformId = inject(PLATFORM_ID);

    if (!isPlatformBrowser(platformId)) {
      return next(req);
    }

    // If already present, do not override
    if (req.headers.has(header)) {
      return next(req);
    }

    const contextConfig: CorrelationIdContextConfig | null = req.context.get(
      CORRELATION_ID_CONTEXT
    );

    // Explicitly disabled via context
    if (contextConfig?.enabled === false) {
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
