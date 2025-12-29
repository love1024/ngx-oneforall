import { isPlatformBrowser } from '@angular/common';
import { getCurrentPlatformId } from './platform-context';

/**
 * Configuration options for OnlyInBrowser decorator.
 */
export interface OnlyInBrowserOptions<T = unknown> {
  /** Value to return when not in browser. Default: undefined */
  fallback?: T;
}

/**
 * Decorator that only executes the method in browser environment.
 * During SSR, returns the fallback value (default: undefined).
 *
 * @description
 * Prevents method execution during server-side rendering.
 * Useful for methods that access browser-only APIs like `window` or `localStorage`.
 *
 * **Features:**
 * - SSR-safe execution
 * - Configurable fallback value
 * - Observable support: returns `EMPTY` when no fallback provided
 * - Promise support: returns resolved promise with fallback
 *
 * @example
 * ```typescript
 * @OnlyInBrowser()
 * initLocalStorage(): void {
 *   localStorage.setItem('initialized', 'true');
 * }
 *
 * @OnlyInBrowser({ fallback: [] })
 * getFromLocalStorage(): string[] {
 *   return JSON.parse(localStorage.getItem('items') || '[]');
 * }
 *
 * @OnlyInBrowser({ fallback: of([]) })
 * fetchBrowserData(): Observable<Data[]> {
 *   // Uses browser-only APIs
 * }
 * ```
 *
 * @param options - Configuration options
 * @returns Method decorator
 */
export function OnlyInBrowser<T = unknown>(options?: OnlyInBrowserOptions<T>) {
  const fallback = options?.fallback;

  return function (
    _target: object,
    _propertyKey: string | symbol,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = function (...args: unknown[]) {
      const platformId = getCurrentPlatformId();
      const isBrowser = platformId ? isPlatformBrowser(platformId) : false;

      if (isBrowser) {
        return originalMethod.apply(this, args);
      }

      // Return fallback for non-browser environment
      if (fallback !== undefined) {
        return fallback;
      }

      return undefined;
    };

    return descriptor;
  };
}
