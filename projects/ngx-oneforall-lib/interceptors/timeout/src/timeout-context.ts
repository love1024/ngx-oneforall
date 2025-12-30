import { HttpContext, HttpContextToken } from '@angular/common/http';

export interface TimeoutContextOptions {
  timeout: number;
  context?: HttpContext;
}

export const TIMEOUT_CONTEXT = new HttpContextToken<number | null>(() => null);

export function withTimeout(options: TimeoutContextOptions) {
  const { context, ...restOptions } = options;
  return (context ?? new HttpContext()).set(
    TIMEOUT_CONTEXT,
    restOptions.timeout
  );
}
