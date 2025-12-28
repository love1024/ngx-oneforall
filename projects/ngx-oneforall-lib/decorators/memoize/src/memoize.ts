import { safeSerialize } from '@ngx-oneforall/utils/safe-serialize';

export function memoize<Args extends unknown[] = unknown[], R = unknown>(
  resolver?: (...args: Args) => string
) {
  return function (
    target: object,
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
      // initialize cache per instance
      if (!self[cacheProp]) {
        Object.defineProperty(self, cacheProp, {
          value: new Map<string, unknown>(),
          configurable: true,
          enumerable: false,
          writable: false,
        });
      }

      const key = resolver?.(...args) ?? safeSerialize(args);
      const cache = self[cacheProp] as Map<string, R>;

      if (cache.has(key)) {
        return cache.get(key)!;
      }

      const result = originalMethod.apply(self, args) as R;

      if (
        result instanceof Promise ||
        result?.constructor?.name === 'Promise'
      ) {
        // if promise already resolved, replace pending promise with resolved value
        const promise = result as unknown as Promise<R>;
        const promiseResult = promise.then(resolved => {
          cache.set(key, resolved);
          return resolved;
        }) as R;
        cache.set(key, promiseResult);
        return promiseResult;
      }

      cache.set(key, result);
      return result;
    } as (...a: Args) => R;

    return descriptor;
  };
}
