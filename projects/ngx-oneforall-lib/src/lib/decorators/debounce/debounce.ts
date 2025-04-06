/**
 * A method decorator that applies a debounce mechanism to the decorated method.
 * The method will only execute after the specified delay has elapsed since the last call.
 *
 * @param delay - The debounce delay in milliseconds. Defaults to 300ms.
 * 
 * @returns A `MethodDecorator` that wraps the original method with a debounced function.
 *
 * ### Example
 * ```typescript
 * class Example {
 *   @debounce(500)
 *   onResize() {
 *     console.log('Resized!');
 *   }
 * }
 * ```
 *
 * ### How it works:
 * - The decorator replaces the original method with a debounced version.
 * - A private `__debouncedFns` map is created on the instance to store debounced functions for each decorated method. 
 *   This is needed to avoid modifiygin method at the prototype level.
 * - If a debounced function for the method does not exist, it is created and stored in the map.
 * - Subsequent calls to the method within the delay period will reset the timer, ensuring the method is only executed once after the delay.
 *
 * @remarks
 * This decorator is particularly useful for event handlers like `resize` or `scroll` 
 * where frequent calls can lead to performance issues.
 */
export function debounce(delay = 300): MethodDecorator {
  return (
    target: unknown,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor
  ) => {
    const original = descriptor.value;

    descriptor.value = function (this: unknown, ...args: unknown[]) {
      const self = this as { __debouncedFns?: Map<string | symbol, Function> };
      if (!self.__debouncedFns) {
        self.__debouncedFns = new Map();
      }
      if (!self.__debouncedFns.has(propertyKey)) {
        self.__debouncedFns.set(
          propertyKey,
          createDebouncedFunction(original.bind(this), delay)
        );
      }

      const debouncedFn = self.__debouncedFns.get(propertyKey)!;
      debouncedFn(...args);
    };

    return descriptor;
  };
}

function createDebouncedFunction(fn: (...args: unknown[]) => void, delay: number) {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: unknown[]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

