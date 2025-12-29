The `withTimeoutInterceptor` adds automatic timeouts to HTTP requests.

## Features

- **Default timeout** — Apply timeout to all requests
- **Per-request override** — Context API for custom timeouts
- **Structured errors** — Typed error with request metadata

## Installation

```typescript
import { withTimeoutInterceptor } from '@ngx-oneforall/interceptors/timeout';
```

## Quick Start

```typescript
provideHttpClient(
  withInterceptors([
    withTimeoutInterceptor(30000) // 30 second default
  ])
);
```

## Per-Request Timeout

Override the default timeout for specific requests:

```typescript
import { withTimeout } from '@ngx-oneforall/interceptors/timeout';

this.http.get('/api/slow-endpoint', {
  context: withTimeout({ timeout: 60000 }) // 60 seconds
});
```

## Error Handling

```typescript
import { TIMEOUT_ERROR } from '@ngx-oneforall/interceptors/timeout';

this.http.get('/api/data').pipe(
  catchError(error => {
    if (error.name === TIMEOUT_ERROR) {
      console.error('Request timed out:', error.message);
    }
    return throwError(() => error);
  })
);
```

### TimeoutErrorInfo

```typescript
interface TimeoutErrorInfo {
  name: 'TimeoutError';        // Always 'TimeoutError'
  message: string;             // 'Request timed out after Xms'
  request: HttpRequest<any>;   // Original request
}
```

## Demo

{{ NgDocActions.demo("TimeoutInterceptorDemoComponent") }}
