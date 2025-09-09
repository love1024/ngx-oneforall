import { HttpContext, HttpContextToken } from '@angular/common/http';

export interface CacheContextOptions {
  enabled?: boolean;
}

export const CACHE_CONTEXT = new HttpContextToken<CacheContextOptions>(
  () => ({})
);

export function cache(options: CacheContextOptions = {}) {
  return new HttpContext().set(CACHE_CONTEXT, {
    enabled: true,
    ...options,
  });
}
