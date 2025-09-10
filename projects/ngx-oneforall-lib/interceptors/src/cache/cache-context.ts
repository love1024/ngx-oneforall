import {
  HttpContext,
  HttpContextToken,
  HttpRequest,
} from '@angular/common/http';
import { CacheOptions } from '@ngx-oneforall/services';

export type CacheContextOptions = Omit<CacheOptions, 'storagePrefix'> & {
  enabled?: boolean;
  key?: string | ((req: HttpRequest<unknown>) => string);
  context?: HttpContext;
};

export const CACHE_CONTEXT = new HttpContextToken<CacheContextOptions>(
  () => ({})
);

export function useCache(options: CacheContextOptions = {}) {
  const { context, ...restOptions } = options;
  return (context ?? new HttpContext()).set(CACHE_CONTEXT, {
    enabled: true,
    ...restOptions,
  });
}
