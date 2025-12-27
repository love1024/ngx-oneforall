import {
  CacheStorageType,
  getStorageEngine,
} from '@ngx-oneforall/services/cache';
import { StorageTransformers } from '@ngx-oneforall/services/storage';
import { safeSerialize } from '@ngx-oneforall/utils';
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

export interface CacheDecoratorOptions {
  storage?: CacheStorageType;
  storageKey?: string;
  ttl?: number | null;
  itemCacheKey?: string;
  maxItems?: number | null;
  version?: string;
  cacheKeyMatcher?: (oldParams: unknown, newParams: unknown) => boolean;
  cacheKeySelector?: (params: unknown[]) => unknown;
}

const DEFAULT_STORAGE_KEY = 'CACHE_DECORATOR';
const DEFAULT_VERSION = Symbol.for('Interval-v1');

const DEFAULT_CACHE_KEY_MATCHER = (
  existingParams: unknown,
  currentParams: unknown
) => safeSerialize(existingParams) === safeSerialize(currentParams);

export const DEFAULT_CACHE_KEY_SELECTOR = (parameters: unknown[]) => parameters;

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
                pendingRequests.indexOf(foundPendingRequest)
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
