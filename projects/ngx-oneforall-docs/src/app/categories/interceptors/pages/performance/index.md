The `withPerformanceInterceptor` measures and reports HTTP request performance automatically.

## Features

- **Automatic timing** — Measures all HTTP requests
- **Slow detection** — Mark requests exceeding a threshold
- **Report control** — Only report slow requests if needed
- **Per-request control** — Disable or label via `HttpContext`
- **SSR-safe** — Falls back to `Date.now()` on server

## Installation

```typescript
import { withPerformanceInterceptor } from '@ngx-oneforall/interceptors/performance';
```

## Quick Start

```typescript
provideHttpClient(
  withInterceptors([
    withPerformanceInterceptor()
  ])
);
```

## Configuration

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `enabled` | `boolean` | `true` | Enable/disable reporting globally |
| `reporter` | `(entry) => void` | `console.debug` | Custom handler for performance entries |
| `slowThresholdMs` | `number` | — | Mark requests exceeding this duration as slow |
| `reportOnlyIfSlow` | `boolean` | `false` | Only report requests that exceed `slowThresholdMs` |

## PerformanceEntry

```typescript
interface PerformanceEntry {
  url: string;        // Request URL
  method: string;     // HTTP method
  durationMs: number; // Duration in milliseconds
  status?: number;    // HTTP status code
  label?: string;     // Custom label
  isSlow?: boolean;   // Exceeded slow threshold
}
```

## Custom Reporter

Reporters run in Angular's injection context, allowing `inject()`:

```typescript
withPerformanceInterceptor({
  reporter: entry => {
    const analytics = inject(AnalyticsService);
    analytics.track('http_request', entry);
  }
});
```

## Slow Request Detection

Mark and optionally filter slow requests:

```typescript
withPerformanceInterceptor({
  slowThresholdMs: 2000,      // 2 seconds
  reportOnlyIfSlow: true      // Only report slow requests
});
```

The default reporter prefixes slow requests with `[HTTP Performance - SLOW]`.

## Context API

```typescript
import { usePerformance } from '@ngx-oneforall/interceptors/performance';
```

### Disable for a Request

```typescript
this.http.get('/api/health', {
  context: usePerformance({ enabled: false })
});
```

### Add Custom Label

```typescript
this.http.post('/api/checkout', cart, {
  context: usePerformance({ label: 'Checkout Flow' })
});
```

### Context Options

| Option | Type | Description |
|--------|------|-------------|
| `enabled` | `boolean` | Disable reporting for this request |
| `label` | `string` | Custom label for identification |
| `context` | `HttpContext` | Existing context to extend |

## Examples

### Alert on Slow Requests

```typescript
withPerformanceInterceptor({
  slowThresholdMs: 2000,
  reporter: entry => {
    if (entry.isSlow) {
      const toast = inject(ToastService);
      toast.warn(`Slow: ${entry.url} took ${entry.durationMs}ms`);
    }
  }
});
```

### Analytics Integration

```typescript
withPerformanceInterceptor({
  reporter: entry => {
    const analytics = inject(AnalyticsService);
    analytics.track('performance', {
      url: entry.url,
      duration: entry.durationMs,
      status: entry.status,
      slow: entry.isSlow
    });
  }
});
```

### Production Slow-Only Monitoring

```typescript
withPerformanceInterceptor({
  slowThresholdMs: 3000,
  reportOnlyIfSlow: true,
  reporter: entry => {
    const logger = inject(LoggingService);
    logger.warn('Slow request', entry);
  }
});
```

## Demo

{{ NgDocActions.demo("PerformanceInterceptorDemoComponent") }}
