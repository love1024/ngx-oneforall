The `catchErrorWithFallback` operator provides a clean, flexible way to handle errors in RxJS streams by automatically switching to a fallback value, observable, or dynamically generated result when an error occurs.

## Why Use catchErrorWithFallback?

Error handling is essential for robust applications, but RxJS's native `catchError` requires manually wrapping fallback values in `of()` observables. This operator simplifies the pattern:

- **Cleaner Code**: No need to wrap static values in `of()`
- **Flexible Fallbacks**: Support for static values, observables, or factory functions
- **Error Callbacks**: Optional `onError` hook for logging or side effects
- **Type Safety**: Full TypeScript support with proper type inference
- **Dynamic Responses**: Factory functions can use the error to determine the fallback

## How to Use

Import the operator from `@ngx-oneforall/rxjs`:

```typescript
import { catchErrorWithFallback } from '@ngx-oneforall/rxjs';
```

### Basic Usage with Static Fallback

```typescript
this.http.get<User>('/api/user').pipe(
  catchErrorWithFallback({ id: 0, name: 'Guest' })
).subscribe(user => {
  console.log(user); // Either API data or fallback guest user
});
```

### Using an Observable Fallback

```typescript
this.http.get<Post[]>('/api/posts').pipe(
  catchErrorWithFallback(this.getCachedPosts())
).subscribe(posts => {
  // Falls back to cached posts on error
});
```

### Dynamic Fallback with Factory Function

```typescript
this.http.delete(`/api/items/${id}`).pipe(
  catchErrorWithFallback((error) => {
    if (error.status === 404) {
      return { success: true, message: 'Already deleted' };
    }
    return { success: false, message: 'Delete failed' };
  })
).subscribe(result => {
  console.log(result.message);
});
```

### With Error Logging

```typescript
this.http.get<Data>('/api/data').pipe(
  catchErrorWithFallback([], {
    onError: (err) => console.error('API failed:', err)
  })
).subscribe(data => {
  // Empty array as fallback, error logged
});
```

## API

### Signature

```typescript
function catchErrorWithFallback<T>(
  fallback: FallbackFactory<T>,
  options?: CatchErrorWithFallbackOptions
): OperatorFunction<T, T>
```

### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `fallback` | `FallbackFactory<T>` | Static value, observable, or factory function |
| `options` | `CatchErrorWithFallbackOptions` | Optional configuration |

### FallbackFactory Type

```typescript
type FallbackFactory<T> =
  | T                                    // Static value
  | Observable<T>                        // Observable
  | ((error: unknown) => T | Observable<T>);  // Factory function
```

### Options

| Option | Type | Description |
|--------|------|-------------|
| `onError` | `(error: unknown) => void` | Callback invoked when an error is caught |

## Behavior

The operator follows these rules:

1. **Pass-Through**: If no error occurs, values pass through unchanged
2. **Static Fallback**: Plain values are automatically wrapped in `of()`
3. **Observable Fallback**: Observables are subscribed to directly
4. **Factory Functions**: Executed with the error, return value wrapped if needed
5. **Error Callback**: `onError` is called before the fallback is applied

## Use Cases

### API with Fallback Data

```typescript
class ProductService {
  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>('/api/products').pipe(
      catchErrorWithFallback(this.getDefaultProducts())
    );
  }

  private getDefaultProducts(): Product[] {
    return [
      { id: 1, name: 'Sample Product', price: 0 }
    ];
  }
}
```

### Graceful Degradation

```typescript
this.configService.getRemoteConfig().pipe(
  catchErrorWithFallback({
    theme: 'light',
    language: 'en',
    features: []
  }, {
    onError: (err) => this.logger.warn('Using default config', err)
  })
).subscribe(config => {
  this.applyConfig(config);
});
```

### Error-Specific Handling

```typescript
this.http.post('/api/payment', paymentData).pipe(
  catchErrorWithFallback((error: any) => {
    if (error.status === 429) {
      return of({ retryAfter: error.headers.get('Retry-After') });
    }
    if (error.status >= 500) {
      return of({ serverError: true });
    }
    return throwError(() => error); // Re-throw client errors
  })
)
```

### Logging and Metrics

```typescript
this.dataService.fetchCriticalData().pipe(
  catchErrorWithFallback(this.getCachedData(), {
    onError: (err) => {
      this.analytics.trackError('critical_data_fetch_failed', err);
      this.notifySupport(err);
    }
  })
)
```

### Form Submission with Retry

```typescript
submitForm(data: FormData): Observable<SubmitResult> {
  return this.http.post<SubmitResult>('/api/submit', data).pipe(
    catchErrorWithFallback((error: any) => {
      // Return observable for async retry logic
      return of(null).pipe(
        delay(2000),
        switchMap(() => this.http.post<SubmitResult>('/api/submit', data))
      );
    }, {
      onError: (err) => console.warn('First attempt failed, retrying...')
    })
  );
}
```

## Comparison with Native catchError

### Native RxJS

```typescript
// Verbose - must wrap in of()
source$.pipe(
  catchError(error => {
    console.error(error);
    return of(defaultValue);
  })
)
```

### With catchErrorWithFallback

```typescript
// Concise - automatic wrapping
source$.pipe(
  catchErrorWithFallback(defaultValue, {
    onError: error => console.error(error)
  })
)
```

## Demo

Explore the operator with an interactive demonstration:

{{ NgDocActions.demo("CatchErrorWithFallbackDemoComponent") }}
