The `withCorrelationIdInterceptor` is an Angular HTTP interceptor that automatically adds a unique correlation ID to each HTTP request. This enables better request tracking, debugging, and distributed tracing across your application and backend services.

## Why Use a Correlation ID Interceptor?

In modern distributed applications, tracking requests across multiple services is crucial for debugging and monitoring. A correlation ID is a unique identifier attached to each request that allows you to:

- **Trace requests** through multiple services and microservices
- **Debug issues** by correlating logs across different systems
- **Monitor performance** by tracking individual request lifecycles
- **Analyze user journeys** by following requests from start to finish

The `withCorrelationIdInterceptor` automates this process, ensuring every HTTP request gets a unique identifier without manual intervention.

## How to Use

Register the interceptor in your Angular application's providers:

```typescript
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { withCorrelationIdInterceptor } from '@ngx-oneforall/interceptors';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
      withInterceptors([withCorrelationIdInterceptor()])
    ),
  ],
};
```

or for NgModule-based applications:

```typescript
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { withCorrelationIdInterceptor } from '@ngx-oneforall/interceptors';

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

By default, the interceptor adds an `X-Correlation-Id` header to all HTTP requests made from the browser.

> **Note:** The interceptor only works in the browser environment and will be skipped in server-side rendering (SSR).

> **Note:** If a correlation ID header already exists, it won't be overridden.

## Configuration Options

You can customize the interceptor's behavior by passing a configuration object:

```typescript
withCorrelationIdInterceptor({
  header: 'X-Request-Id',  // Custom header name
  idGenerator: () => `req-${Date.now()}-${Math.random()}`  // Custom ID generator
})
```

### Available Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `header` | `string` | `'X-Correlation-Id'` | The name of the header to add to requests |
| `idGenerator` | `() => string` | `crypto.randomUUID()` fallback | Function to generate unique IDs |

### Default ID Generator

The default ID generator uses `crypto.randomUUID()` if available, otherwise falls back to a timestamp-based approach:

```typescript
const defaultId = crypto.randomUUID() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`;
```

## Context API

You can control the correlation ID on a per-request basis using the `useCorrelationId` context function:

### Disable for Specific Requests

```typescript
import { useCorrelationId } from '@ngx-oneforall/interceptors';

this.http.get('/api/public', {
  context: useCorrelationId({ enabled: false })
});
```

### Provide Custom ID

```typescript
this.http.post('/api/data', payload, {
  context: useCorrelationId({ id: 'custom-correlation-id-123' })
});
```

### Context Options

| Option | Type | Description |
|--------|------|-------------|
| `enabled` | `boolean` | Set to `false` to disable correlation ID for this request |
| `id` | `string` | Provide a specific correlation ID instead of generating one |
| `context` | `HttpContext` | Use an existing HttpContext object |

## Behavior

The interceptor follows these rules:

1. **Browser Only**: Only operates in browser environments (skips SSR)
2. **No Override**: If a correlation ID header already exists, it won't be overridden
3. **Context Priority**: Context configuration takes precedence over global settings
4. **Automatic Generation**: Generates a unique ID for each request if not provided

## Use Cases

### Distributed Tracing

```typescript
// Frontend request with correlation ID
this.http.get('/api/orders/123').subscribe();
// Header: X-Correlation-Id: 550e8400-e29b-41d4-a716-446655440000

// Backend can use this ID in logs:
// [550e8400-e29b-41d4-a716-446655440000] Order service: Fetching order 123
// [550e8400-e29b-41d4-a716-446655440000] Database: Query executed
```

### Custom ID Format

```typescript
withCorrelationIdInterceptor({
  idGenerator: () => {
    const userId = getCurrentUserId();
    const timestamp = Date.now();
    return `${userId}-${timestamp}`;
  }
})
```

### Per-Request Tracking

```typescript
// Track a specific user action
const actionId = 'checkout-' + crypto.randomUUID();

this.http.post('/api/checkout', cart, {
  context: useCorrelationId({ id: actionId })
}).subscribe();
```

## Demo

Explore a live demonstration of the correlation ID interceptor:

{{ NgDocActions.demo("CorrelationIdInterceptorDemoComponent") }}
