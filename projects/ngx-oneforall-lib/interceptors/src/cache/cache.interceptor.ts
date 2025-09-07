import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { CacheService } from '@ngx-oneforall/services';
import { CACHE_CONTEXT } from './cache-context';

export const cacheInterceptor: HttpInterceptorFn = (req, next) => {
  const cacheService = inject(CacheService);

  if (req.context.get(CACHE_CONTEXT) === true) {
    return next(req);
  }

  return next(req);
};
