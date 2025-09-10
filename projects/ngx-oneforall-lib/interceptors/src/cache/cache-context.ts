import {
  HttpContext,
  HttpContextToken,
  HttpRequest,
} from '@angular/common/http';
import { CacheOptions } from '@ngx-oneforall/services';

export type CacheContextOptions = Omit<CacheOptions, 'storagePrefix'> & {
  enabled?: boolean;
  key?: string | ((req: HttpRequest<unknown>) => string);
};

export const CACHE_CONTEXT = new HttpContextToken<CacheContextOptions>(
  () => ({})
);

export function cache(options: CacheContextOptions = {}) {
  return new HttpContext().set(CACHE_CONTEXT, {
    enabled: true,
    ...options,
  });
}
