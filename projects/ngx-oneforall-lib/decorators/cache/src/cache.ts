import {
  CacheStorageType,
  getStorageEngine,
} from 'ngx-oneforall/services/cache';
import { StorageTransformers } from 'ngx-oneforall/services/storage';
import { safeSerialize } from 'ngx-oneforall/utils/safe-serialize';
import { finalize, Observable, of, shareReplay, tap } from 'rxjs';

interface CacheData<T> {
  parameters: unknown[];
  response: T;
  savedAt: number | null;
}

interface CacheMetaData {
  version: string;
  createdAt: number;
}

interface CachedObject {
  __meta__?: CacheMetaData;
  data: Record<string, CacheData<unknown>[]>;
}

/**
 * Configuration options for the Cache decorator.
 */
export interface CacheDecoratorOptions {
  /** Storage type: 'memory', 'local', or 'session'. Default: 'memory' */
  storage?: CacheStorageType;
  /** Key used to store cache in storage. Default: 'CACHE_DECORATOR' */
  storageKey?: string;
  /** Time-to-live in milliseconds. null = no expiration. Default: null */
  ttl?: number | null;
  /** Custom cache key for this method. Default: ClassName-methodName */
  itemCacheKey?: string;
  /** Maximum cached items per method. null = unlimited. Default: null */
  maxItems?: number | null;
  /** Cache version. Changing this clears all cached data. */
  version?: string;
  /** Custom function to compare cached params with new params. */
  cacheKeyMatcher?: (oldParams: unknown, newParams: unknown) => boolean;
  /** Custom function to select which params to use as cache key. */
  cacheKeySelector?: (params: unknown[]) => unknown;
}

const DEFAULT_STORAGE_KEY = 'CACHE_DECORATOR';
const DEFAULT_VERSION = '__interval-v1';

const DEFAULT_CACHE_KEY_MATCHER = (
  existingParams: unknown,
  currentParams: unknown
) => safeSerialize(existingParams) === safeSerialize(currentParams);

export const DEFAULT_CACHE_KEY_SELECTOR = (parameters: unknown[]) => parameters;

/**
 * Decorator that caches Observable method results with configurable storage, TTL, and versioning.
 *
 * @description
 * Caches the result of Observable-returning methods. Supports multiple storage backends,
 * time-to-live expiration, version-based cache invalidation, and deduplication of in-flight requests.
 *
 * **Features:**
 * - Multi-storage support (memory, localStorage, sessionStorage)
 * - TTL-based expiration
 * - Version control (cache cleared on version change)
 * - Pending request deduplication via shareReplay
 * - LRU-style eviction with maxItems
 * - Failed requests are NOT cached
 *
 * @example
 * ```typescript
 * class UserService {
 *   @Cache({ ttl: 60000, storage: 'local' })
 *   getUser(id: number): Observable<User> {
 *     return this.http.get<User>(`/api/users/${id}`);
 *   }
 *
 *   @Cache({ maxItems: 10, version: '1.0.0' })
 *   searchUsers(query: string): Observable<User[]> {
 *     return this.http.get<User[]>(`/api/users?q=${query}`);
 *   }
 * }
 * ```
 *
 * @param cacheConfig - Configuration options for caching behavior
 * @returns Method decorator
 */
export function Cache(cacheConfig: CacheDecoratorOptions = {}) {
  return function (
    target: object,
    propertyKey: string,
    propertyDescriptor: PropertyDescriptor
  ) {
    const options = mergeWithDefaultConfig(cacheConfig);
    const cacheKey =
      options.itemCacheKey ||
      (target?.constructor?.name || 'ROOT') + '-' + propertyKey;
    const storageKey = options.storageKey;
    const cacheService = getStorageEngine(options.storage);
    const pendingRequests: CacheData<Observable<unknown>>[] = [];
    const originalMethod = propertyDescriptor.value;
    if (!originalMethod) {
      return;
    }

    propertyDescriptor.value = function (...parameters: unknown[]) {
      let cachedObject =
        (cacheService.get(
          storageKey,
          StorageTransformers.JSON
        ) as CachedObject) ?? {};
      let cachedItems = cachedObject.data?.[cacheKey] ?? [];

      // --- Version check ---
      const meta = cachedObject.__meta__;
      if (!meta || meta.version !== options.version) {
        cachedObject = {
          __meta__: { version: options.version, createdAt: Date.now() },
          data: {},
        };
        cacheService.set(storageKey, cachedObject, StorageTransformers.JSON);
      }

      const saveCachedItems = () => {
        cachedObject.data[cacheKey] = cachedItems;
        cacheService.set(storageKey, cachedObject, StorageTransformers.JSON);
      };

      const enforceMaxItems = () => {
        if (
          options.maxItems !== null &&
          cachedItems.length > options.maxItems
        ) {
          cachedItems = cachedItems.slice(-options.maxItems);
          saveCachedItems();
        }
      };

      // Enforce updated maxItems immediately
      enforceMaxItems();

      const parametersHash = options.cacheKeySelector(parameters);
      let foundCachedItem = cachedItems.find(item =>
        options.cacheKeyMatcher(item.parameters, parametersHash)
      );
      const foundPendingRequest = pendingRequests.find(item =>
        options.cacheKeyMatcher(item.parameters, parametersHash)
      );

      // If item is found, user has not provided null for ttl, and time is expired
      if (
        foundCachedItem &&
        foundCachedItem.savedAt &&
        options.ttl &&
        isItemExpired(foundCachedItem.savedAt, options.ttl)
      ) {
        cachedItems = cachedItems.filter(item => item !== foundCachedItem);
        foundCachedItem = undefined;
      }

      if (foundCachedItem) {
        saveCachedItems();
        return of(foundCachedItem.response);
      } else if (foundPendingRequest) {
        return foundPendingRequest.response;
      } else {
        const response$ = (
          originalMethod.call(this, ...parameters) as Observable<unknown>
        ).pipe(
          finalize(() => {
            // Remove request from pending requests
            const foundPendingRequest = pendingRequests.find(item =>
              options.cacheKeyMatcher(item.parameters, parametersHash)
            );
            if (foundPendingRequest) {
              pendingRequests.splice(
                pendingRequests.indexOf(foundPendingRequest),
                1
              );
            }
          }),
          tap((res: unknown) => {
            if (
              options.maxItems !== null &&
              cachedItems.length >= options.maxItems
            ) {
              // Remove first item
              cachedItems = cachedItems.slice(1);
            }

            cachedItems.push({
              parameters,
              response: res,
              savedAt: options.ttl ? Date.now() : null,
            } satisfies CacheData<unknown>);

            saveCachedItems();
          }),
          shareReplay({ bufferSize: 1, refCount: true })
        );

        pendingRequests.push({
          parameters,
          response: response$,
          savedAt: Date.now(),
        });

        return response$;
      }
    };
  };
}

const mergeWithDefaultConfig = (
  config: CacheDecoratorOptions
): Required<CacheDecoratorOptions> => {
  return {
    storage: config.storage || 'memory',
    storageKey: config.storageKey || DEFAULT_STORAGE_KEY,
    ttl: config.ttl ?? null,
    itemCacheKey: config.itemCacheKey || '',
    maxItems: config.maxItems ?? null,
    cacheKeyMatcher: config.cacheKeyMatcher || DEFAULT_CACHE_KEY_MATCHER,
    cacheKeySelector: config.cacheKeySelector || DEFAULT_CACHE_KEY_SELECTOR,
    version: config.version || DEFAULT_VERSION.toString(),
  };
};

const isItemExpired = (createdAt: number, ttl: number) => {
  return Date.now() - createdAt > ttl;
};
