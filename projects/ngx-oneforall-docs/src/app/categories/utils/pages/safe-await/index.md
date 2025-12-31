![Bundle Size](https://deno.bundlejs.com/badge?q=ngx-oneforall/utils/safe-await&treeshake=[*]&config={"esbuild":{"external":["rxjs","@angular/core","@angular/common","@angular/forms","@angular/router"]}})

Go-style error handling for async operations. Returns a tuple `[result, error]` instead of throwing, eliminating try/catch blocks.

## Usage

```typescript
import { safeAwait } from 'ngx-oneforall/utils/safe-await';
```

## API

```typescript
safeAwait<T>(input: Promise<T> | Observable<T>): Promise<[T, null] | [null, Error]>
```

| Input | Success | Failure |
|-------|---------|---------|
| `Promise<T>` | `[result, null]` | `[null, error]` |
| `Observable<T>` | `[lastValue, null]` | `[null, error]` |

> **Note**
> Observables are converted using `lastValueFrom`. Empty Observables (complete without emitting) will return an `EmptyError`.

## Quick Example

```typescript
const [user, error] = await safeAwait(fetchUser(id));

if (error) {
  console.error('Failed:', error.message);
  return;
}

console.log(user.name); // TypeScript knows user is defined
```

## Comparison: Traditional vs safeAwait

```typescript
// ❌ Traditional try/catch
async function getUser(id: string) {
  try {
    const user = await fetchUser(id);
    return { user, error: null };
  } catch (error) {
    return { user: null, error };
  }
}

// ✅ With safeAwait
async function getUser(id: string) {
  const [user, error] = await safeAwait(fetchUser(id));
  return { user, error };
}
```

## Example: HTTP Request

```typescript
async loadData() {
  const [data, error] = await safeAwait(
    this.http.get<User[]>('/api/users')
  );

  if (error) {
    this.errorMessage = 'Failed to load users';
    return;
  }

  this.users = data;
}
```

## Example: Multiple Async Operations

```typescript
async saveOrder() {
  const [inventory, invError] = await safeAwait(checkInventory(this.items));
  if (invError) return this.showError('Inventory check failed');

  const [payment, payError] = await safeAwait(processPayment(this.total));
  if (payError) return this.showError('Payment failed');

  const [order, orderError] = await safeAwait(createOrder(inventory, payment));
  if (orderError) return this.showError('Order creation failed');

  return order;
}
```

## Use Cases

- **HTTP requests**: Handle API errors without try/catch
- **Form submission**: Clean async validation and submission
- **Sequential operations**: Chain multiple async calls with clear error points
- **Observable integration**: Use with Angular's HttpClient seamlessly
