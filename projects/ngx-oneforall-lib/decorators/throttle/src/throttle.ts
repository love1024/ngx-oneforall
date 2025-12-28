/**
 * A method decorator that throttles the execution of the decorated method.
 * Ensures that the method is only invoked once within the specified delay period.
 *
 * @param delay - The delay period in milliseconds during which subsequent calls
 *                to the method will be ignored. Defaults to 300ms.
 * @returns A method decorator function.
 *
 * @throws {TypeError} If the decorator is applied to a non-method property.
 *
 * @example
 * ```typescript
 * class Example {
 *   @throttle(500)
 *   handleClick() {
 *     console.log('Button clicked');
 *   }
 * }
 *
 * const example = new Example();
 * example.handleClick(); // Executes immediately
 * example.handleClick(); // Ignored if called within 500ms
 * ```
 */
export function throttle(delay = 300): MethodDecorator {
  return (
    target: unknown,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor
  ) => {
    const original = descriptor.value;

    // Not needed as typescript comiler will throw an error
    // if (typeof original !== 'function') {
    //   throw new TypeError(`@throttle can only be applied to methods`);
    // }

    // Create a WeakMap to store the last call state for each instance
    const lastCallMap = new WeakMap<object, boolean>();

    descriptor.value = function (this: object, ...args: unknown[]) {
      if (lastCallMap.has(this)) {
        return;
      }
      lastCallMap.set(this, true);

      const result = original.apply(this, args);

      setTimeout(() => {
        lastCallMap.delete(this);
      }, delay);

      return result;
    };

    return descriptor;
  };
}
