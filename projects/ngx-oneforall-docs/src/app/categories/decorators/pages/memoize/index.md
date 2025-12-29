The `@memoize` decorator caches method results based on arguments. Works with sync and Promise methods.

> **Note**
> **When to use:** Use `@memoize` for sync or Promise methods. For Observable methods, use [`@Cache`](/decorators/cache) instead.

### Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `resolver` | `(...args) => string` | `safeSerialize` | Custom cache key function |
| `maxSize` | `number` | `undefined` | Max cache entries (LRU eviction) |

### Features

- **Sync and Promise support** - Caches both method returns and promise resolutions
- **Per-instance caching** - No shared state between instances
- **Custom key resolver** - Use object IDs instead of full serialization
- **Max cache size** - Limit cache with LRU eviction

### Basic Usage

```typescript
import { memoize } from '@ngx-oneforall/decorators/memoize';

@memoize()
factorial(n: number): number {
  if (n <= 1) return 1;
  return n * this.factorial(n - 1);
}
```

### Async Support

```typescript
@memoize()
fetchUser(id: string): Promise<User> {
  return this.http.get<User>(`/api/users/${id}`).toPromise();
}
// Second call returns cached promise
```

### Custom Resolver

```typescript
@memoize({ resolver: (user: User) => user.id })
processUser(user: User) {
  // Uses user.id as cache key instead of full serialization
}
```

### Max Cache Size

```typescript
@memoize({ maxSize: 100 })
compute(input: string): number {
  // Cache limited to 100 entries, oldest evicted first
}
```

### Best Practices

- **Pure methods only** - Don't use on methods with side effects
- **Use maxSize for large caches** - Prevent memory leaks
- **Use resolver for objects with IDs** - Faster than serialization

### Live Demonstration

{{ NgDocActions.demo("MemoizeDecoratorComponent") }}
