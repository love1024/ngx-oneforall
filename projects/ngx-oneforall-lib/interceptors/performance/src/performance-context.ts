import { HttpContext, HttpContextToken } from '@angular/common/http';

export interface PerformanceContextConfig {
  enabled?: boolean;
  context?: HttpContext;
  label?: string;
}

export const PERFORMANCE_CONTEXT =
  new HttpContextToken<PerformanceContextConfig>(() => ({}));

export function usePerformance(options: PerformanceContextConfig = {}) {
  const { context, ...restOptions } = options;
  return (context ?? new HttpContext()).set(PERFORMANCE_CONTEXT, {
    enabled: true,
    ...restOptions,
  });
}
