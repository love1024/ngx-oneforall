The \`@memoize\` decorator is a powerful performance optimization tool that caches the results of method calls based on their arguments. It ensures that expensive computations or repetitive operations are only executed once for a given set of inputs.

### How it Works

When a method is decorated with \`@memoize\`, the decorator intercepts calls to that method. It generates a unique cache key based on the arguments passed to the method.
- If the result for those arguments is already in the cache, it returns the cached result immediately.
- If not, it executes the original method, stores the result in the cache, and then returns it.

This is particularly useful for:
- **Expensive Calculations**: Mathematical computations, data transformations, or complex logic.
- **Pure Functions**: Methods where the output is determined solely by the input arguments and have no side effects.
- **Repetitive Calls**: Scenarios where the same method is called frequently with the same parameters (e.g., inside loops or template bindings).

### Key Features

- **Argument-Based Caching**: Automatically generates cache keys from method arguments.
- **Custom Resolvers**: Allows you to define custom logic for generating cache keys.
- **Promise Support**: Handles Promise-returning methods by caching the promise itself (and updating with the resolved value), preventing duplicate async operations.
- **Zero Configuration**: Works out of the box with sensible defaults.

### Usage Example

```typescript
import { memoize } from '@ngx-oneforall/decorators/memoize';

class MathService {
  @memoize()
  factorial(n: number): number {
    console.log('Computing factorial...');
    if (n === 0 || n === 1) return 1;
    return n * this.factorial(n - 1);
  }
}
```

### Async Support

The \`@memoize\` decorator seamlessly handles methods that return Promises. When an async method is called:
1. The returned Promise is cached immediately.
2. Subsequent calls return the same Promise, preventing duplicate execution.
3. Once the Promise resolves, the cache is updated with the resolved value (if applicable, though typically the Promise itself remains the cached entity to handle subsequent calls correctly).

```typescript
class ApiService {
  @memoize()
  fetchUserData(userId: string): Promise<User> {
    return this.http.get<User>(`/api/users/${userId}`).toPromise();
  }
}
```

### Configuration Options

The \`@memoize\` decorator accepts an optional `resolver` function as an argument.

#### Resolver Function
Type: `(...args: any[]) => string`

A function that accepts the method's arguments and returns a string to be used as the cache key. If not provided, the default behavior is to serialize the arguments using `safeSerialize`.

```typescript
// Example with custom resolver
@memoize((user: User) => user.id)
processUser(user: User) {
  // ...
}
```

### Best Practices

- **Use on Pure Methods**: Avoid using \`@memoize\` on methods that rely on external state (like `this.someProperty`) unless that state is also part of the cache key (via a custom resolver).
- **Memory Management**: Be aware that the cache grows indefinitely by default. For caches that need expiration or size limits, consider using the `@Cache` decorator instead.
- **Complex Arguments**: For methods with complex object arguments, the default serializer works well, but a custom resolver can be faster if you have a unique ID available.

### Live Demonstration

{{ NgDocActions.demo("MemoizeDecoratorComponent") }}
