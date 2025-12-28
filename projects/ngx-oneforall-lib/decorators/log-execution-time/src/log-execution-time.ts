export function LogExecutionTime(label?: string): MethodDecorator {
  return (target, propertyKey, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value!;

    descriptor.value = function (...args: unknown[]) {
      const start = performance.now();

      // Execute the original method
      const result = originalMethod.apply(this, args);

      // Handle both synchronous and asynchronous methods
      if (
        result instanceof Promise ||
        result?.constructor?.name === 'Promise'
      ) {
        return result.finally(() => {
          const end = performance.now();
          console.log(
            `[${label || propertyKey.toString()}] executed in ${(end - start).toFixed(2)} ms`
          );
        });
      } else {
        const end = performance.now();
        console.log(
          `[${label || propertyKey.toString()}] executed in ${(end - start).toFixed(2)} ms`
        );
        return result;
      }
    };

    return descriptor;
  };
}
