import { HttpContext, HttpContextToken } from '@angular/common/http';

export interface CorrelationIdContextConfig {
  enabled?: boolean;
  id?: string;
  context?: HttpContext;
}

export const CORRELATION_ID_CONTEXT =
  new HttpContextToken<CorrelationIdContextConfig>(() => ({}));

export function useCorrelationId(options: CorrelationIdContextConfig = {}) {
  const { context, ...restOptions } = options;
  return (context ?? new HttpContext()).set(CORRELATION_ID_CONTEXT, {
    enabled: true,
    ...restOptions,
  });
}
