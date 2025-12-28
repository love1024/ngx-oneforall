import { isObservable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export function CatchError(fallback?: unknown, logError = true) {
  return function (
    _target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const original = descriptor.value;

    descriptor.value = function (...args: any[]) {
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
