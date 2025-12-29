import {
  HttpInterceptorFn,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';
import {
  InternalCacheService,
  getStorageEngine,
} from '@ngx-oneforall/services/cache';
import { CACHE_CONTEXT, CacheContextOptions } from './cache-context';
import { of, tap } from 'rxjs';
import { isPlatformServer } from '@angular/common';

/**
 * Cache strategy type.
 * - `'auto'`: Cache all GET requests with JSON response type
 * - `'manual'`: Only cache requests with explicit cache context
 */
export type CacheStrategy = 'auto' | 'manual';

/**
 * Storage type for cache.
 */
export type CacheStorageType = 'memory' | 'local' | 'session';

/**
 * Configuration for the cache interceptor.
 */
export interface CacheInterceptorConfig {
  /** Cache strategy. Default: 'manual' */
  strategy?: CacheStrategy;
  /** Default storage type. Default: 'memory' */
  storage?: CacheStorageType;
  /** Default TTL in milliseconds. Default: 1 hour */
  ttl?: number;
  /** Storage key prefix */
  storagePrefix?: string;
  /** Cache version for invalidation */
  version?: string;
  /**
   * Function to run custom logic on every request, useful for cache invalidation.
   * Runs inside the injection context.
   * Return `true` to clear the entire cache.
   */
  cacheBust?: (req: HttpRequest<unknown>) => boolean | void;
}

/**
 * Resolves the cache key for a request.
 */
function resolveKey(req: HttpRequest<unknown>, context: CacheContextOptions) {
  const { key } = context;

  if (key) {
    return typeof key === 'function' ? key(req) : key;
  }

  return req.urlWithParams;
}

/**
 * Determines if a request is cacheable.
 *
 * Cacheable in following cases:
 * 1. Strategy is 'auto' and request is GET with JSON response
 * 2. Strategy is 'manual' and context.enabled is true
 */
function isCacheable(
  req: HttpRequest<unknown>,
  strategy: CacheStrategy,
  context: CacheContextOptions
) {
  if (strategy === 'auto') {
    return req.method === 'GET' && req.responseType === 'json';
  }
  return strategy === 'manual' && context.enabled;
}

/**
 * Creates an HTTP interceptor that caches responses.
 *
 * @param config - Cache interceptor configuration
 * @returns An Angular HTTP interceptor function
 *
 * @example
 * ```typescript
 * provideHttpClient(
 *   withInterceptors([
 *     withCacheInterceptor({
 *       strategy: 'auto',
 *       storage: 'memory',
 *       ttl: 60000
 *     })
 *   ])
 * );
 * ```
 *
 * @remarks
 * - SSR-safe: skips caching on server
 * - Supports per-request overrides via `CACHE_CONTEXT`
 * - Creates internal CacheService instance
 */
export function withCacheInterceptor(config: CacheInterceptorConfig = {}) {
  const {
    strategy = 'manual',
    storage = 'memory',
    ttl,
    storagePrefix,
    version,
    cacheBust,
  } = config;

  // Create internal CacheService instance
  const storageEngine = getStorageEngine(storage, storagePrefix);
  const cacheService = new InternalCacheService(
    storageEngine,
    getStorageEngine,
    ttl,
    version
  );

  const cacheInterceptor: HttpInterceptorFn = (req, next) => {
    const platformId = inject(PLATFORM_ID);

    if (isPlatformServer(platformId)) {
      return next(req);
    }

    if (cacheBust?.(req)) {
      cacheService.clear();
    }

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
