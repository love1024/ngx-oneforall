import { safeSerialize } from '@ngx-oneforall/utils/safe-serialize';

/**
 * Configuration options for the memoize decorator.
 */
export interface MemoizeOptions<Args extends unknown[] = unknown[]> {
  /** Custom key resolver function. Default: serializes all arguments. */
  resolver?: (...args: Args) => string;
  /** Maximum cache size. When exceeded, oldest entries are removed. Default: unlimited */
  maxSize?: number;
}

/**
 * Memoizes method results based on arguments.
 * Caches sync and Promise results per instance.
 *
 * @description
 * Creates a per-instance cache that stores results keyed by the serialized arguments.
 * Subsequent calls with the same arguments return the cached result.
 *
 * **Features:**
 * - Sync and Promise support
 * - Per-instance caching (no shared state between instances)
 * - Custom key resolver
 * - Optional max cache size with LRU eviction
 *
 * @example
 * ```typescript
 * class Calculator {
 *   @memoize()
 *   expensiveCalculation(n: number): number {
 *     // Complex computation...
 *     return result;
 *   }
 *
 *   @memoize({ maxSize: 10 })
 *   async fetchData(id: string): Promise<Data> {
 *     return await this.api.getData(id);
 *   }
 *
 *   @memoize({ resolver: (a, b) => `${a}-${b}` })
 *   combine(a: string, b: number): string {
 *     return a.repeat(b);
 *   }
 * }
 * ```
 *
 * @param options - Configuration options or custom resolver function
 * @returns Method decorator
 */
export function memoize<Args extends unknown[] = unknown[], R = unknown>(
  options?: MemoizeOptions<Args> | ((...args: Args) => string)
) {
  const config: MemoizeOptions<Args> =
    typeof options === 'function' ? { resolver: options } : (options ?? {});

  return function (
    _target: object,
    propertyKey: string,
    descriptor: TypedPropertyDescriptor<(...args: Args) => R>
  ): TypedPropertyDescriptor<(...args: Args) => R> | void {
    if (!descriptor || typeof descriptor.value !== 'function') {
      return descriptor;
    }

    const originalMethod = descriptor.value as (...args: Args) => R;
    const cacheProp = Symbol(`__memoize_cache_${propertyKey}`);

    descriptor.value = function (this: unknown, ...args: Args): R {
      const self = this as Record<PropertyKey, unknown>;

      // Initialize cache per instance
      if (!self[cacheProp]) {
        Object.defineProperty(self, cacheProp, {
          value: new Map<string, R>(),
          configurable: true,
          enumerable: false,
          writable: false,
        });
      }

      const key = config.resolver?.(...args) ?? safeSerialize(args);
      const cache = self[cacheProp] as Map<string, R>;

      if (cache.has(key)) {
        return cache.get(key)!;
      }

      const result = originalMethod.apply(self, args) as R;

      // Handle Promise - replace pending promise with resolved value
      if (
        result instanceof Promise ||
        result?.constructor?.name === 'Promise'
      ) {
        const promise = (result as unknown as Promise<R>).then(resolved => {
          cache.set(key, resolved as R);
          return resolved;
        }) as R;

        evictIfNeeded(cache, config.maxSize);
        cache.set(key, promise);
        return promise;
      }

      // Handle sync
      evictIfNeeded(cache, config.maxSize);
      cache.set(key, result);
      return result;
    } as (...a: Args) => R;

    return descriptor;
  };
}

/**
 * Evicts oldest entry if cache exceeds maxSize.
 */
function evictIfNeeded<K, V>(cache: Map<K, V>, maxSize?: number): void {
  if (maxSize && cache.size >= maxSize) {
    const firstKey = cache.keys().next().value;
    if (firstKey !== undefined) {
      cache.delete(firstKey);
    }
  }
}
