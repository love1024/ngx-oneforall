import { HttpContext, HttpContextToken } from '@angular/common/http';

export interface BaseUrlContextConfig {
  enabled?: boolean;
  baseUrl?: string | (() => string);
  context?: HttpContext;
}

export const BASE_URL_CONTEXT = new HttpContextToken<BaseUrlContextConfig>(
  () => ({})
);

export function useBaseUrl(options: BaseUrlContextConfig = {}) {
  const { context, ...restOptions } = options;
  return (context ?? new HttpContext()).set(BASE_URL_CONTEXT, {
    enabled: true,
    ...restOptions,
  });
}
