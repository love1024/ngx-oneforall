![Bundle Size](https://deno.bundlejs.com/badge?q=ngx-oneforall/decorators/catch-error&treeshake=[*]&config={"esbuild":{"external":["rxjs","@angular/core","@angular/common","@angular/forms","@angular/router"]}})

The `CatchError` decorator catches errors and provides fallback behavior for sync, Promise, and Observable methods.

### Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `fallback` | `unknown \| ((error) => unknown)` | `undefined` | Value or function to return on error |
| `logError` | `boolean` | `true` | Log errors to console |

### Features

- **Sync methods**: Wraps in try-catch
- **Promises**: Adds `.catch()` handler
- **Observables**: Pipes through `catchError`
- **Dynamic fallback**: Function receives error, can return dynamic value
- **Re-throw**: If `fallback` is undefined, error is re-thrown

### Basic Usage

```typescript
// Static fallback value
@CatchError([])
getUsers(): Observable<User[]> {
  return this.http.get<User[]>('/api/users');
}
```

### Dynamic Fallback

```typescript
// Fallback function receives error
@CatchError((err) => ({ error: true, message: err.message }))
async fetchData(): Promise<Data> {
  return await this.api.getData();
}
```

### Observable Fallback

```typescript
// Return Observable from fallback
@CatchError((err) => of({ fallback: true }))
getData(): Observable<any> {
  return throwError(() => new Error('fail'));
}
```

### Silent Errors

```typescript
// Disable console logging
@CatchError(null, false)
silentFetch(): Observable<any> { ... }
```

### Live Demonstration

{{ NgDocActions.demo("CatchErrorDemoComponent") }}
