import {
  HttpInterceptorFn,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';
import { CacheService } from '@ngx-oneforall/services';
import { CACHE_CONTEXT, CacheContextOptions } from './cache-context';
import { of, tap } from 'rxjs';
import { isPlatformServer } from '@angular/common';

type strategy = 'auto' | 'manual';

function resolveKey(req: HttpRequest<unknown>, context: CacheContextOptions) {
  const { key } = context;

  if (key) {
    return typeof key === 'function' ? key(req) : key;
  }

  return req.urlWithParams;
}

/**
 * Request is cacheable in following two cases
 * 1. User has manually added cache context and it is enabled
 * 2. The interceptor is running with auto strategy and the request is get with json response
 */
function isCacheable(
  req: HttpRequest<unknown>,
  strategy: strategy,
  context: CacheContextOptions
) {
  if (strategy === 'auto') {
    return req.method === 'GET' && req.responseType === 'json';
  }
  return strategy === 'manual' && context.enabled;
}

export function withCacheInterceptor(strategy: strategy = 'manual') {
  const cacheInterceptor: HttpInterceptorFn = (req, next) => {
    const platformId = inject(PLATFORM_ID);

    if (isPlatformServer(platformId)) {
      return next(req);
    }

    const cacheService = inject(CacheService);
    const context = req.context.get(CACHE_CONTEXT);

    const key = resolveKey(req, context);

    if (isCacheable(req, strategy, context)) {
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

  return cacheInterceptor;
}
