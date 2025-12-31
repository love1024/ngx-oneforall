![Bundle Size](https://deno.bundlejs.com/badge?q=ngx-oneforall/interceptors/correlation-id&treeshake=[*]&config={"esbuild":{"external":["rxjs","@angular/core","@angular/common","@angular/forms","@angular/router"]}})

The `withCorrelationIdInterceptor` is an Angular HTTP interceptor that automatically adds a unique correlation ID header to each HTTP request. It enables request tracking, debugging, and distributed tracing across services.

## Features

- **Automatic ID generation** — Unique ID added to every request
- **Distributed tracing** — Track requests across microservices
- **Custom header name** — Use your own header (default: `X-Correlation-Id`)
- **Custom ID generator** — Provide your own ID generation logic
- **Per-request control** — Disable or override via `HttpContext`
- **SSR-compatible** — Works on both server and browser

## Installation

```typescript
import { withCorrelationIdInterceptor } from 'ngx-oneforall/interceptors/correlation-id';
```

## Quick Start

### Standalone Applications

```typescript
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { withCorrelationIdInterceptor } from 'ngx-oneforall/interceptors/correlation-id';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
      withInterceptors([withCorrelationIdInterceptor()])
    ),
  ],
};
```

### NgModule Applications

```typescript
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { withCorrelationIdInterceptor } from 'ngx-oneforall/interceptors/correlation-id';

@NgModule({
  providers: [
    { 
      provide: HTTP_INTERCEPTORS, 
      useValue: withCorrelationIdInterceptor(), 
      multi: true 
    }
  ]
})
export class AppModule {}
```

### Result

Every request automatically includes a correlation ID:

```
GET /api/users
X-Correlation-Id: 550e8400-e29b-41d4-a716-446655440000
```

## Configuration

### CorrelationIdConfig

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `header` | `string` | `'X-Correlation-Id'` | Header name for the correlation ID |
| `idGenerator` | `() => string` | `crypto.randomUUID()` | Function to generate unique IDs |

### Custom Header Name

```typescript
withCorrelationIdInterceptor({
  header: 'X-Request-Id'
})
```

### Custom ID Generator

```typescript
withCorrelationIdInterceptor({
  idGenerator: () => `req-${Date.now()}-${Math.random().toString(16).slice(2)}`
})
```

### Default ID Generator

Uses `crypto.randomUUID()` when available, with a fallback for older browsers:

```typescript
crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`
```

## Behavior

### Processing Order

The interceptor processes requests in the following order:

1. **Check context** — If disabled via `HttpContext`, pass through
2. **Check existing header** — If header already present, don't override
3. **Add correlation ID** — Use context ID, or generate a new one

### SSR Support

The interceptor is fully compatible with server-side rendering (SSR) and will add correlation IDs to requests made on the server.

### Existing Headers Preserved

If a request already has the correlation ID header, it won't be overridden:

```typescript
// Manual header takes precedence
this.http.get('/api/data', {
  headers: { 'X-Correlation-Id': 'my-custom-id' }
});
```

## Context API

Control the interceptor on a per-request basis using `useCorrelationId`:

```typescript
import { useCorrelationId } from 'ngx-oneforall/interceptors/correlation-id';
```

### Disable for a Request

```typescript
this.http.get('/api/public', {
  context: useCorrelationId({ enabled: false })
});
```

### Use a Specific ID

```typescript
this.http.post('/api/checkout', cart, {
  context: useCorrelationId({ id: 'checkout-flow-12345' })
});
```

### Context Options

| Option | Type | Description |
|--------|------|-------------|
| `enabled` | `boolean` | Set `false` to skip adding correlation ID |
| `id` | `string` | Use a specific ID instead of generating one |
| `context` | `HttpContext` | Extend an existing `HttpContext` |

## Examples

### Distributed Tracing

Track requests across your entire system:

```typescript
// Frontend sends request
this.http.get('/api/orders/123').subscribe();
// Header: X-Correlation-Id: 550e8400-e29b-41d4-a716-446655440000

// Backend logs with the same ID
// [550e8400-...] API Gateway: Received request
// [550e8400-...] Order Service: Fetching order 123
// [550e8400-...] Database: Query executed in 15ms
```

### User-Scoped IDs

Include user context in correlation IDs:

```typescript
withCorrelationIdInterceptor({
  idGenerator: () => {
    const userId = inject(AuthService).userId();
    return `${userId}-${crypto.randomUUID()}`;
  }
})
```

### Action Tracking

Track specific user actions:

```typescript
const checkoutId = `checkout-${crypto.randomUUID()}`;

// All checkout-related requests share the same correlation ID
this.http.post('/api/validate-cart', cart, {
  context: useCorrelationId({ id: checkoutId })
});

this.http.post('/api/process-payment', payment, {
  context: useCorrelationId({ id: checkoutId })
});

this.http.post('/api/create-order', order, {
  context: useCorrelationId({ id: checkoutId })
});
```

### Multiple Header Formats

Different backend services may expect different headers:

```typescript
// For AWS X-Ray
withCorrelationIdInterceptor({ header: 'X-Amzn-Trace-Id' });

// For Zipkin
withCorrelationIdInterceptor({ header: 'X-B3-TraceId' });

// For custom systems
withCorrelationIdInterceptor({ header: 'X-Request-Id' });
```

## Demo

Explore a live demonstration of the correlation ID interceptor:

{{ NgDocActions.demo("CorrelationIdInterceptorDemoComponent") }}
