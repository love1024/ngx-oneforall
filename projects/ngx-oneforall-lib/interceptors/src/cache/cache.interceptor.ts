import {
  HttpInterceptorFn,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { CacheService } from '@ngx-oneforall/services';
import { CACHE_CONTEXT, CacheContextOptions } from './cache-context';
import { of, tap } from 'rxjs';

function resolveKey(req: HttpRequest<unknown>, context: CacheContextOptions) {
  const { key } = context;

  if (key) {
    return typeof key === 'function' ? key(req) : key;
  }

  return req.urlWithParams;
}

export const cacheInterceptor: HttpInterceptorFn = (req, next) => {
  const cacheService = inject(CacheService);
  const context = req.context.get(CACHE_CONTEXT);

  const key = resolveKey(req, context);

  if (context.enabled === true) {
    if (cacheService.has(key)) {
      return of(cacheService.get(key)! as HttpResponse<unknown>);
    }

    return next(req).pipe(
      tap(event => {
        if (event instanceof HttpResponse) {
          cacheService.set(key, event, {
            ttl: context.ttl,
            storage: context.storage,
          });
        }
      })
    );
  }

  return next(req);
};
