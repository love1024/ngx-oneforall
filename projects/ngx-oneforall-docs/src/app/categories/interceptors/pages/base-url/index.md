The `withBaseUrlInterceptor` is an Angular HTTP interceptor that automatically prepends a base URL to all relative HTTP requests. It eliminates repetitive URL construction across your application.

## Features

- **Single configuration point** — Define your API base URL once
- **Relative paths** — Use `/users` instead of `https://api.example.com/users`
- **Dynamic URLs** — Support for functions that resolve URLs at runtime
- **Path-specific overrides** — Route different paths to different base URLs
- **Per-request control** — Disable or override via `HttpContext`
- **Smart slash handling** — Automatically normalizes trailing/leading slashes

## Installation

```typescript
import { withBaseUrlInterceptor } from '@ngx-oneforall/interceptors/base-url';
```

## Quick Start

### Standalone Applications

```typescript
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { withBaseUrlInterceptor } from '@ngx-oneforall/interceptors/base-url';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
      withInterceptors([
        withBaseUrlInterceptor({ baseUrl: 'https://api.example.com' })
      ])
    ),
  ],
};
```

### NgModule Applications

```typescript
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { withBaseUrlInterceptor } from '@ngx-oneforall/interceptors/base-url';

@NgModule({
  providers: [
    { 
      provide: HTTP_INTERCEPTORS, 
      useValue: withBaseUrlInterceptor({ baseUrl: 'https://api.example.com' }), 
      multi: true 
    }
  ]
})
export class AppModule {}
```

### Making Requests

```typescript
// Before (without interceptor)
this.http.get('https://api.example.com/users');

// After (with interceptor)
this.http.get('/users'); // → https://api.example.com/users
```

## Configuration

### BaseUrlConfig

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `baseUrl` | `string \| (() => string)` | **Yes** | Default base URL for all relative requests |
| `overrides` | `BaseUrlOverrides[]` | No | Path-specific base URL overrides |

### BaseUrlOverrides

| Property | Type | Description |
|----------|------|-------------|
| `startWith` | `string` | Path prefix to match (e.g., `'auth'`, `'api/v2'`) |
| `url` | `string \| (() => string)` | Base URL to use when prefix matches |

> **Warning**
> The `baseUrl` option is required. The interceptor throws an error if not provided.

## Behavior

### Processing Order

The interceptor processes requests in the following order:

1. **Check context** — If disabled via `HttpContext`, pass through unchanged
2. **Check absolute URL** — If the request URL starts with `http://` or `https://`, pass through unchanged
3. **Resolve base URL** — Use context override, matching path override, or default `baseUrl`
4. **Join URLs** — Combine base URL and request path with proper slash handling

### Smart Slash Handling

The interceptor automatically normalizes slashes between the base URL and path:

```typescript
// All produce: https://api.example.com/users

withBaseUrlInterceptor({ baseUrl: 'https://api.example.com/' })
this.http.get('/users')   // trailing + leading slash

withBaseUrlInterceptor({ baseUrl: 'https://api.example.com' })
this.http.get('users')    // no slashes

withBaseUrlInterceptor({ baseUrl: 'https://api.example.com/' })
this.http.get('users')    // trailing slash only
```

### Absolute URLs Pass Through

Requests with absolute URLs are never modified:

```typescript
this.http.get('/users');                          // → https://api.example.com/users
this.http.get('https://other-api.com/data');      // → https://other-api.com/data (unchanged)
```

## Context API

Control the interceptor on a per-request basis using `useBaseUrl`:

```typescript
import { useBaseUrl } from '@ngx-oneforall/interceptors/base-url';
```

### Disable for a Request

```typescript
this.http.get('https://external-api.com/data', {
  context: useBaseUrl({ enabled: false })
});
```

### Override Base URL

```typescript
this.http.get('/admin/settings', {
  context: useBaseUrl({ baseUrl: 'https://admin-api.example.com' })
});
```

### Context Options

| Option | Type | Description |
|--------|------|-------------|
| `enabled` | `boolean` | Set `false` to skip base URL prepending |
| `baseUrl` | `string \| (() => string)` | Override the configured base URL |
| `context` | `HttpContext` | Extend an existing `HttpContext` |

## Examples

### Environment-Based Configuration

```typescript
// environments/environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000'
};

// environments/environment.prod.ts
export const environment = {
  production: true,
  apiUrl: 'https://api.production.com'
};

// app.config.ts
import { environment } from './environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
      withInterceptors([
        withBaseUrlInterceptor({ baseUrl: environment.apiUrl })
      ])
    ),
  ],
};
```

### Dynamic URL with Dependency Injection

Use a function to resolve the base URL dynamically in the injection context:

```typescript
import { inject, InjectionToken } from '@angular/core';

export const API_URL = new InjectionToken<string>('API_URL');

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: API_URL, useValue: 'https://api.example.com' },
    provideHttpClient(
      withInterceptors([
        withBaseUrlInterceptor({
          baseUrl: () => inject(API_URL)
        })
      ])
    ),
  ],
};
```

### Path-Specific Overrides

Route specific path prefixes to different base URLs:

```typescript
withBaseUrlInterceptor({
  baseUrl: 'https://api.example.com',
  overrides: [
    { startWith: 'auth', url: 'https://auth.example.com' },
    { startWith: 'api/v2', url: 'https://api-v2.example.com' },
    { startWith: 'assets', url: () => inject(ASSETS_URL) }
  ]
})
```

**Matching behavior:**
- `/auth/login` → `https://auth.example.com/auth/login`
- `/api/v2/users` → `https://api-v2.example.com/api/v2/users`
- `/users` → `https://api.example.com/users`

> **Note**
> Overrides are matched in array order. The first matching prefix wins.

### Mixed API Endpoints

```typescript
// Default: all requests use https://api.example.com
export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
      withInterceptors([
        withBaseUrlInterceptor({ baseUrl: 'https://api.example.com' })
      ])
    ),
  ],
};

// Override for specific requests
@Injectable()
class AnalyticsService {
  constructor(private http: HttpClient) {}

  trackEvent(event: string) {
    return this.http.post('/events', { event }, {
      context: useBaseUrl({ baseUrl: 'https://analytics.example.com' })
    });
  }
}
```

## Demo

Explore a live demonstration of the base URL interceptor:

{{ NgDocActions.demo("BaseUrlInterceptorDemoComponent") }}
