import { isObservable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

/**
 * Decorator that catches errors and provides fallback behavior.
 * Works with sync methods, Promises, and Observables.
 *
 * @description
 * Wraps a method to catch any thrown errors or rejected promises/observables.
 * If a fallback is provided, returns it instead of throwing. If fallback is
 * a function, it receives the error and can return a dynamic value.
 *
 * @example
 * ```typescript
 * class DataService {
 *   // Return fallback value on error
 *   @CatchError([])
 *   getUsers(): Observable<User[]> { ... }
 *
 *   // Dynamic fallback based on error
 *   @CatchError((err) => ({ error: err.message }))
 *   getData(): Promise<Data> { ... }
 *
 *   // Disable logging
 *   @CatchError(null, false)
 *   silentFetch(): Observable<any> { ... }
 * }
 * ```
 *
 * @param fallback - Value or function to return on error. If undefined, error is re-thrown.
 * @param logError - Whether to log errors to console (default: true)
 * @returns Method decorator
 */
export function CatchError(fallback?: unknown, logError = true) {
  return function (
    _target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const original = descriptor.value;

    descriptor.value = function (...args: unknown[]) {
      try {
        const result = original.apply(this, args);

        // 🔹 Observable
        if (isObservable(result)) {
          return result.pipe(
            catchError(error => {
              if (logError) {
                console.error(`[CatchError] ${propertyKey}`, error);
              }

              const resolved =
                typeof fallback === 'function' ? fallback(error) : fallback;

              if (isObservable(resolved)) {
                return resolved;
              }

              return resolved !== undefined
                ? of(resolved)
                : throwError(() => error);
            })
          );
        }

        // 🔹 Promise
        if (
          result &&
          typeof result.then === 'function' &&
          typeof result.catch === 'function'
        ) {
          return result.catch((error: unknown) => {
            if (logError) {
              console.error(`[CatchError] ${propertyKey}`, error);
            }

            return typeof fallback === 'function' ? fallback(error) : fallback;
          });
        }

        // 🔹 Sync
        return result;
      } catch (error) {
        if (logError) {
          console.error(`[CatchError] ${propertyKey}`, error);
        }

        return typeof fallback === 'function' ? fallback(error) : fallback;
      }
    };

    return descriptor;
  };
}
