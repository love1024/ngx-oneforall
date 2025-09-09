import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { CacheService } from '@ngx-oneforall/services';
import { CACHE_CONTEXT } from './cache-context';
import { of, tap } from 'rxjs';

export const cacheInterceptor: HttpInterceptorFn = (req, next) => {
  const cacheService = inject(CacheService);
  const key = req.urlWithParams;

  if (req.context.get(CACHE_CONTEXT).enabled === true) {
    if (cacheService.has(key)) {
      return of(cacheService.get(key)! as HttpResponse<unknown>);
    }

    return next(req).pipe(
      tap(event => {
        if (event instanceof HttpResponse) {
          cacheService.set(key, event);
        }
      })
    );
  }

  return next(req);
};
