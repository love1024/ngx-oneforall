import { finalize, isObservable, Observable } from 'rxjs';

/** Global flag to enable/disable execution time logging */
let LOG_EXECUTION_TIME_ENABLED = true;

/**
 * Disables execution time logging globally.
 * Call this in production to prevent console output.
 *
 * @example
 * ```typescript
 * // main.ts
 * if (environment.production) {
 *   disableLogExecutionTime();
 * }
 * ```
 */
export function disableLogExecutionTime(): void {
  LOG_EXECUTION_TIME_ENABLED = false;
}

/**
 * Enables execution time logging globally.
 * Logging is enabled by default.
 */
export function enableLogExecutionTime(): void {
  LOG_EXECUTION_TIME_ENABLED = true;
}

/**
 * Returns whether execution time logging is currently enabled.
 */
export function isLogExecutionTimeEnabled(): boolean {
  return LOG_EXECUTION_TIME_ENABLED;
}

/**
 * Decorator that logs method execution time to console.
 * Works with sync methods, Promises, and Observables.
 *
 * Can be globally disabled using `disableLogExecutionTime()`.
 *
 * @param label - Custom label for log message (default: method name)
 *
 * @example
 * ```typescript
 * class DataService {
 *   @LogExecutionTime()
 *   fetchData(): Observable<Data> { ... }
 *
 *   @LogExecutionTime('CustomLabel')
 *   processData(): Promise<void> { ... }
 * }
 *
 * // Disable in production
 * if (environment.production) {
 *   disableLogExecutionTime();
 * }
 * ```
 *
 * @returns Method decorator
 */
export function LogExecutionTime(label?: string): MethodDecorator {
  return (
    _target: object,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor
  ) => {
    const originalMethod = descriptor.value!;

    descriptor.value = function (...args: unknown[]) {
      // Skip if disabled
      if (!LOG_EXECUTION_TIME_ENABLED) {
        return originalMethod.apply(this, args);
      }

      const start = performance.now();
      const logLabel = label || propertyKey.toString();

      const logTime = () => {
        const end = performance.now();
        console.log(`[${logLabel}] executed in ${(end - start).toFixed(2)} ms`);
      };

      const result = originalMethod.apply(this, args);

      // Handle Observable
      if (isObservable(result)) {
        return (result as Observable<unknown>).pipe(finalize(logTime));
      }

      // Handle Promise
      if (
        result instanceof Promise ||
        result?.constructor?.name === 'Promise'
      ) {
        return result.finally(logTime);
      }

      // Handle sync
      logTime();
      return result;
    };

    return descriptor;
  };
}
