/**
 * Configuration options for the throttle decorator.
 */
export interface ThrottleOptions {
  /** Delay in milliseconds. Default: 300 */
  delay?: number;
  /** Execute on leading edge. Default: true */
  leading?: boolean;
  /** Execute on trailing edge. Default: false */
  trailing?: boolean;
}

/** Throttle state per instance/method */
interface ThrottleState {
  isThrottled: boolean;
  lastArgs: unknown[] | null;
  lastResult: unknown;
}

/** Symbol for storing throttle states */
const THROTTLE_STATES = Symbol('__throttleStates');

/** Instance with throttle state storage */
interface ThrottledInstance {
  [THROTTLE_STATES]?: Map<string | symbol, ThrottleState>;
}

/**
 * Throttles method execution to once per delay period.
 * Limits how often a method can be called.
 *
 * @description
 * Ensures the method executes at most once per delay period.
 * Unlike debounce (delays until quiet), throttle executes immediately
 * and ignores subsequent calls during the delay.
 *
 * **Features:**
 * - Leading edge execution (default: true)
 * - Optional trailing edge execution
 * - Per-instance throttling
 * - Returns cached result during throttle period
 *
 * @example
 * ```typescript
 * // Basic usage - executes immediately, ignores calls for 300ms
 * @throttle()
 * handleScroll() { ... }
 *
 * // With trailing edge - also executes after delay
 * @throttle({ delay: 500, trailing: true })
 * savePosition() { ... }
 *
 * // Trailing only - executes at end of throttle period
 * @throttle({ delay: 1000, leading: false, trailing: true })
 * batchUpdates() { ... }
 * ```
 *
 * @param options - Delay in ms or options object
 * @returns Method decorator
 */
export function throttle(
  options: number | ThrottleOptions = 300
): MethodDecorator {
  const config: Required<ThrottleOptions> =
    typeof options === 'number'
      ? { delay: options, leading: true, trailing: false }
      : {
          delay: options.delay ?? 300,
          leading: options.leading ?? true,
          trailing: options.trailing ?? false,
        };

  return (
    _target: object,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor
  ) => {
    const original = descriptor.value;

    descriptor.value = function (this: ThrottledInstance, ...args: unknown[]) {
      if (!this[THROTTLE_STATES]) {
        this[THROTTLE_STATES] = new Map();
      }

      if (!this[THROTTLE_STATES].has(propertyKey)) {
        this[THROTTLE_STATES].set(propertyKey, {
          isThrottled: false,
          lastArgs: null,
          lastResult: undefined,
        });
      }

      const state = this[THROTTLE_STATES].get(propertyKey)!;

      // During throttle period - store args for trailing, return cached result
      if (state.isThrottled) {
        if (config.trailing) {
          state.lastArgs = args;
        }
        return state.lastResult;
      }
      state.isThrottled = true;

      if (config.leading) {
        state.lastResult = original.apply(this, args);
      }

      setTimeout(() => {
        if (config.trailing && state.lastArgs) {
          state.lastResult = original.apply(this, state.lastArgs);
          state.lastArgs = null;
        }
        state.isThrottled = false;
      }, config.delay);

      return state.lastResult;
    };

    return descriptor;
  };
}
