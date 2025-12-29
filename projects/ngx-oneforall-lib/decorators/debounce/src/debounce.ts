/**
 * Options for the debounce decorator.
 */
export interface DebounceOptions {
  /** Delay in milliseconds. Default: 300 */
  delay?: number;
  /** Execute on leading edge (immediately on first call). Default: false */
  leading?: boolean;
}

/** Private symbol to store debounced functions on instance */
const DEBOUNCED_FNS = Symbol('debouncedFns');
const LAST_RESULTS = Symbol('lastResults');

interface DebouncedInstance {
  [DEBOUNCED_FNS]?: Map<string | symbol, (...args: unknown[]) => void>;
  [LAST_RESULTS]?: Map<string | symbol, unknown>;
}

/**
 * A method decorator that applies a debounce mechanism to the decorated method.
 * The method will only execute after the specified delay has elapsed since the last call.
 *
 * @param options - Debounce options or delay in milliseconds
 *
 * @returns A `MethodDecorator` that wraps the original method with a debounced function.
 *
 * @example
 * ```typescript
 * class Example {
 *   // Basic usage (trailing edge)
 *   @debounce(500)
 *   onResize() {
 *     console.log('Resized!');
 *   }
 *
 *   // With options
 *   @debounce({ delay: 300, leading: true })
 *   onScroll() {
 *     console.log('Scrolled!');
 *   }
 * }
 * ```
 *
 * @remarks
 * - The decorator replaces the original method with a debounced version.
 * - A private Symbol-keyed map stores debounced functions per instance.
 * - Returns the last result from the original method (useful for caching).
 * - With `leading: true`, executes immediately on first call, then debounces.
 */
export function debounce(
  options: number | DebounceOptions = 300
): MethodDecorator {
  const config: Required<DebounceOptions> =
    typeof options === 'number'
      ? { delay: options, leading: false }
      : { delay: options.delay ?? 300, leading: options.leading ?? false };

  return (
    _target: unknown,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor
  ) => {
    const original = descriptor.value;

    descriptor.value = function (this: DebouncedInstance, ...args: unknown[]) {
      if (!this[DEBOUNCED_FNS]) {
        this[DEBOUNCED_FNS] = new Map();
      }
      if (!this[LAST_RESULTS]) {
        this[LAST_RESULTS] = new Map();
      }

      if (!this[DEBOUNCED_FNS].has(propertyKey)) {
        const debouncedFn = createDebouncedFunction(
          (...callArgs: unknown[]) => {
            const result = original.apply(this, callArgs);
            this[LAST_RESULTS]!.set(propertyKey, result);
            return result;
          },
          config.delay,
          config.leading
        );
        this[DEBOUNCED_FNS].set(propertyKey, debouncedFn);
      }

      const debouncedFn = this[DEBOUNCED_FNS].get(propertyKey)!;
      debouncedFn(...args);

      // Return last cached result
      return this[LAST_RESULTS].get(propertyKey);
    };

    return descriptor;
  };
}

function createDebouncedFunction(
  fn: (...args: unknown[]) => unknown,
  delay: number,
  leading: boolean
) {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  let isLeadingInvoked = false;

  return (...args: unknown[]) => {
    if (leading && !isLeadingInvoked) {
      isLeadingInvoked = true;
      fn(...args);
    }

    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      // Skip calling if leading is true to avoid duplicate calls
      // In next call, the above case will execute it
      if (!leading) {
        fn(...args);
      }
      isLeadingInvoked = false;
      timeoutId = null;
    }, delay);
  };
}
