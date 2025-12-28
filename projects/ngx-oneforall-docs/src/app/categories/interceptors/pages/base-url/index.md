The `withBaseUrlInterceptor` is an Angular HTTP interceptor that automatically prepends a configured base URL to all relative HTTP requests. This simplifies API calls throughout your application by eliminating the need to repeatedly specify the full API endpoint in every request.

## Why Use a Base URL Interceptor?

When building Angular applications that communicate with backend APIs, you typically need to make many HTTP requests to the same domain. Hardcoding the full URL for every request is repetitive and makes it difficult to switch between environments (development, staging, production). The `withBaseUrlInterceptor` solves this by:

- **Centralizing configuration**: Define your API base URL once in the interceptor configuration
- **Simplifying requests**: Use relative paths like `/users` instead of `https://api.example.com/users`
- **Environment flexibility**: Easily switch base URLs between environments
- **Cleaner code**: Keep your service methods focused on business logic, not URL construction

## How to Use

Register the interceptor in your Angular application's providers with a base URL:

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

or for NgModule-based applications:

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

Now you can make requests with relative URLs:

```typescript
// Instead of: this.http.get('https://api.example.com/users')
this.http.get('/users').subscribe(users => {
  // The interceptor automatically prepends the base URL
});
```

## Configuration

The interceptor requires a configuration object with a `baseUrl` property:

| Option | Type | Required | Description |
|--------|------|----------|-------------|
| `baseUrl` | `string \| (() => string)` | **Yes** | The base URL to prepend to relative requests. Can be a string or a function. |
| `overrides` | `BaseUrlOverrides[]` | No | List of overrides for specific paths. |

### BaseUrlOverrides Interface

| Property | Type | Description |
| -------- | ---- | ----------- |
| `startWith` | `string` | Prefix to match against the request URL (e.g. `'auth'`). |
| `url` | `string \| (() => string)` | The URL to use instead of `baseUrl` if the match succeeds. |

> **Warning**
> The `baseUrl` is required. The interceptor will throw an error if it's not provided.

## Behavior

The interceptor follows these rules:

1. **Relative URLs Only**: Only prepends the base URL to relative request paths (e.g., `/users`, `api/data`)
2. **Absolute URLs Unchanged**: If a request URL is already absolute (starts with `http://` or `https://`), it's left unchanged
3. **Smart Slash Handling**: Automatically handles trailing/leading slashes between the base URL and path
4. **Context Override**: Per-request configuration via `HttpContext` takes precedence

### Smart Slash Handling

The interceptor intelligently joins the base URL and request path, regardless of trailing or leading slashes:

```typescript
// All of these produce: https://api.example.com/users

// Base URL with trailing slash, path with leading slash
withBaseUrlInterceptor({ baseUrl: 'https://api.example.com/' })
this.http.get('/users')

// Base URL without trailing slash, path without leading slash
withBaseUrlInterceptor({ baseUrl: 'https://api.example.com' })
this.http.get('users')

// Base URL with trailing slash, path without leading slash
withBaseUrlInterceptor({ baseUrl: 'https://api.example.com/' })
this.http.get('users')
```

## Context API

You can control or override the base URL on a per-request basis using the `useBaseUrl` context function:

### Disable for Specific Requests

```typescript
import { useBaseUrl } from '@ngx-oneforall/interceptors/base-url';

// Skip the interceptor for this request
this.http.get('/users', {
  context: useBaseUrl({ enabled: false })
});
```

### Override Base URL for Specific Requests

```typescript
// Use a different base URL for this specific request
this.http.get('/admin/settings', {
  context: useBaseUrl({ baseUrl: 'https://admin-api.example.com' })
});
```

### Context Options

| Option | Type | Description |
|--------|------|-------------|
| `enabled` | `boolean` | Set to `false` to skip base URL prepending for this request |
| `baseUrl` | `string \| (() => string)` | Override the configured base URL for this specific request. Can be a string or a function. |
| `context` | `HttpContext` | Use an existing HttpContext object |

## Use Cases

### Environment-Specific Configuration

```typescript
// environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000'
};

// environment.prod.ts
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

### Environment-Specific Configuration (Functional)
Using a function allows `baseUrl` to be resolved dynamically in the injection context, enabling the use of `inject()`.

```typescript
import { inject, InjectionToken } from '@angular/core';

export const API_URL = new InjectionToken<string>('API_URL');

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: API_URL, useValue: 'https://api.example.com' },
    provideHttpClient(
      withInterceptors([
        withBaseUrlInterceptor({
          // Use inject() to get the URL from a token
          baseUrl: () => inject(API_URL)
        })
      ])
    ),
  ],
};
```

### URL Overrides
You can configure overrides to point specific URL prefixes to different base URLs.

```typescript
withBaseUrlInterceptor({
  baseUrl: 'https://api.example.com',
  overrides: [
    // Redirects /auth/... to https://auth.example.com/auth/...
    { startWith: 'auth', url: 'https://auth.example.com' },
    // Resolving functional url
    { startWith: 'assets', url: () => inject(ASSETS_URL) }
  ]
})
```

### Mixed API Endpoints

```typescript
// Most requests go to the main API
export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
      withInterceptors([
        withBaseUrlInterceptor({ baseUrl: 'https://api.example.com' })
      ])
    ),
  ],
};

// But some requests need a different base
class AnalyticsService {
  trackEvent(event: string) {
    return this.http.post('/events', { event }, {
      context: useBaseUrl({ baseUrl: 'https://analytics.example.com' })
    });
  }
}
```

### External API Calls

```typescript
// Regular API calls use the base URL
this.http.get('/users').subscribe(); // → https://api.example.com/users

// External APIs are left unchanged
this.http.get('https://external-api.com/data').subscribe(); // → https://external-api.com/data
```

## Demo

Explore a live demonstration of the base URL interceptor:

{{ NgDocActions.demo("BaseUrlInterceptorDemoComponent") }}
