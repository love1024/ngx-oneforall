The `withPerformanceInterceptor` is an Angular HTTP interceptor that automatically measures and reports the performance of HTTP requests. This is invaluable for monitoring, debugging, and optimizing API call performance in your Angular applications.

## Why Use a Performance Interceptor?

Understanding how long your HTTP requests take is crucial for:

- **Performance Monitoring**: Track API response times in real-time
- **Bottleneck Identification**: Quickly identify slow endpoints
- **User Experience Optimization**: Ensure fast, responsive applications
- **Debugging**: Correlate slow requests with specific API calls
- **Analytics**: Collect performance data for analysis and reporting

The `withPerformanceInterceptor` automates this process, providing consistent performance measurements across all HTTP requests without manual instrumentation.

## How to Use

Register the interceptor in your Angular application's providers:

```typescript
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { withPerformanceInterceptor } from '@ngx-oneforall/interceptors/performance';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
      withInterceptors([withPerformanceInterceptor({})])
    ),
  ],
};
```

or for NgModule-based applications:

```typescript
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { withPerformanceInterceptor } from '@ngx-oneforall/interceptors/performance';

@NgModule({
  providers: [
    { 
      provide: HTTP_INTERCEPTORS, 
      useValue: withPerformanceInterceptor({}), 
      multi: true 
    }
  ]
})
export class AppModule {}
```

By default, the interceptor logs performance metrics to `console.debug`.

## Configuration Options

Customize the interceptor's behavior with configuration options:

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `enabled` | `boolean` | `true` | Globally enable or disable performance reporting |
| `reporter` | `(entry: PerformanceEntry) => void` | `console.debug` | Custom function to handle performance reports |

### PerformanceEntry Interface

Each performance report contains:

```typescript
interface PerformanceEntry {
  url: string;         // Request URL
  method: string;      // HTTP method (GET, POST, etc.)
  durationMs: number;  // Request duration in milliseconds
  status?: number;     // HTTP status code
  label?: string;      // Optional custom label
}
```

### Custom Reporter

Implement a custom reporter to handle metrics your way:

```typescript
const customReporter = (entry: PerformanceEntry) => {
  // Send to analytics service
  analyticsService.track('http_performance', {
    endpoint: entry.url,
    duration: entry.durationMs,
    status: entry.status,
  });
  
  // Log slow requests
  if (entry.durationMs > 1000) {
    console.warn('Slow request detected:', entry);
  }
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
      withInterceptors([
        withPerformanceInterceptor({ reporter: customReporter })
      ])
    ),
  ],
};
```

### Injection Context in Reporters

> **Important**
> Reporters are called within an Angular injection context, allowing you to use `inject()` to access Angular services directly.

This is particularly useful for sending metrics to analytics services or logging systems:

```typescript
import { inject } from '@angular/core';
import { AnalyticsService } from './analytics.service';

const analyticsReporter = (entry: PerformanceEntry) => {
  // You can inject services directly in the reporter
  const analytics = inject(AnalyticsService);
  
  analytics.trackPerformance({
    url: entry.url,
    duration: entry.durationMs,
    status: entry.status,
    label: entry.label,
  });
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
      withInterceptors([
        withPerformanceInterceptor({ reporter: analyticsReporter })
      ])
    ),
  ],
};
```

**Benefits of injection context:**
- Access to Angular services without manual dependency management
- Type-safe service injection
- Cleaner, more maintainable code
- Seamless integration with your existing service infrastructure

## Context API

Control performance reporting on a per-request basis using the `usePerformance` context function:

### Disable for Specific Requests

```typescript
import { usePerformance } from '@ngx-oneforall/interceptors/performance';

// Skip performance reporting for this request
this.http.get('/api/health', {
  context: usePerformance({ enabled: false })
});
```

### Add Custom Labels

```typescript
// Label specific requests for easier tracking
this.http.post('/api/checkout', cart, {
  context: usePerformance({ label: 'Checkout Flow' })
}).subscribe();
```

### Context Options

| Option | Type | Description |
|--------|------|-------------|
| `enabled` | `boolean` | Set to `false` to disable reporting for this request |
| `label` | `string` | Add a custom label to identify this request type |
| `context` | `HttpContext` | Use an existing HttpContext object |

## Behavior

The interceptor follows these rules:

1. **Automatic Measurement**: Measures every HTTP request from start to completion
2. **Error Tracking**: Reports performance even when requests fail
3. **Non-Blocking**: Runs asynchronously without impacting request performance
4. **Precise Timing**: Uses `performance.now()` for high-precision measurements

## Use Cases

### Performance Monitoring Service

```typescript
import { inject } from '@angular/core';

class PerformanceMonitorService {
  private metrics: PerformanceEntry[] = [];
  
  addMetric(entry: PerformanceEntry) {
    this.metrics.push(entry);
  }
  
  getAverageResponseTime(): number {
    if (this.metrics.length === 0) return 0;
    const sum = this.metrics.reduce((acc, m) => acc + m.durationMs, 0);
    return sum / this.metrics.length;
  }
}

const monitoringReporter = (entry: PerformanceEntry) => {
  const monitor = inject(PerformanceMonitorService);
  monitor.addMetric(entry);
  
  console.log(`Average: ${monitor.getAverageResponseTime().toFixed(2)}ms`);
};

export const appConfig: ApplicationConfig = {
  providers: [
    PerformanceMonitorService,
    provideHttpClient(
      withInterceptors([
        withPerformanceInterceptor({ reporter: monitoringReporter })
      ])
    ),
  ],
};
```

### Alerting on Slow Requests

```typescript
import { inject } from '@angular/core';
import { ToastService } from './toast.service';

const alertingReporter = (entry: PerformanceEntry) => {
  const SLOW_THRESHOLD = 2000; // 2 seconds
  
  if (entry.durationMs > SLOW_THRESHOLD) {
    const toast = inject(ToastService);
    toast.showWarning(
      `Slow request: ${entry.url} took ${entry.durationMs.toFixed(0)}ms`
    );
  }
};
```

### Analytics Integration

```typescript
import { inject } from '@angular/core';
import { AnalyticsService } from './analytics.service';

const analyticsReporter = (entry: PerformanceEntry) => {
  const analytics = inject(AnalyticsService);
  
  analytics.track('http_request', {
    category: 'performance',
    label: entry.label || entry.url,
    value: Math.round(entry.durationMs),
    status: entry.status,
  });
};
```

### Labeled Request Groups

```typescript
class UserService {
  getUserProfile() {
    return this.http.get('/api/user/profile', {
      context: usePerformance({ label: 'User Profile' })
    });
  }
  
  getUserSettings() {
    return this.http.get('/api/user/settings', {
      context: usePerformance({ label: 'User Settings' })
    });
  }
}
```

## Default Reporter

If no custom reporter is provided, the interceptor uses the default reporter which logs to `console.debug`:

```typescript
export const defaultPerformanceReporter = (entry: PerformanceEntry) => {
  console.debug('[HTTP Performance]', entry);
};
```

This is useful for development but should be replaced with a custom reporter in production.

## Demo

Explore a live demonstration of the performance interceptor:

{{ NgDocActions.demo("PerformanceInterceptorDemoComponent") }}
