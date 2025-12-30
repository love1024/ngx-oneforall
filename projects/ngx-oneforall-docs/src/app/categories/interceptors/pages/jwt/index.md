The `withJwtInterceptor` attaches JWT tokens to outgoing HTTP requests for allowed domains.

## Features

- **Automatic token attachment** — Add JWT to requests automatically
- **Domain filtering** — Only attach tokens to allowed domains
- **Route exclusions** — Skip specific URLs
- **Token refresh (optional)** — Handle 401 errors with automatic refresh
- **Per-request control** — Disable via `HttpContext`
- **SSR-safe** — Skips on server-side rendering

## Installation

```typescript
import { withJwtInterceptor } from 'ngx-oneforall/interceptors/jwt';
```

## Quick Start

```typescript
provideHttpClient(
  withInterceptors([
    withJwtInterceptor({
      tokenGetter: () => localStorage.getItem('access_token')
    })
  ])
);
```

## Configuration

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `tokenGetter` | `() => string \| null` | **Required** | Function that returns the JWT |
| `authScheme` | `string` | `'Bearer '` | Prefix for the token |
| `headerName` | `string` | `'Authorization'` | Header name for the token |
| `allowedDomains` | `(string \| RegExp)[]` | `[]` | Domains to receive the token (empty = all allowed) |
| `skipUrls` | `(string \| RegExp)[]` | `[]` | URLs to exclude from token attachment |
| `skipAddingIfExpired` | `boolean` | `false` | Skip if token is expired |
| `errorOnNoToken` | `boolean` | `false` | Throw if no token available |
| `refreshTokenHandler` | `RefreshTokenHandler` | — | Handler for automatic token refresh |

> **Note**
> The current origin (`document.location.origin`) is always allowed, even if not in `allowedDomains`.

## Token Refresh

Handle 401 errors with automatic token refresh:

```typescript
withJwtInterceptor({
  tokenGetter: () => localStorage.getItem('token'),
  refreshTokenHandler: {
    refreshToken: () => authService.refresh(),
    logout: () => router.navigate(['/login'])
  }
});
```

### RefreshTokenHandler Interface

```typescript
interface RefreshTokenHandler {
  refreshToken(): Observable<string>;
  logout(): void;
}
```

### Refresh Behavior

- **Automatic retry** — Failed requests retry with new token
- **Deduplication** — Multiple 401s trigger only one refresh
- **Logout on failure** — Calls `logout()` if refresh fails
- **No handler = no refresh** — 401 errors propagate as-is

## Context API

```typescript
import { withSkipJwtInterceptor } from 'ngx-oneforall/interceptors/jwt';
```

### Skip for a Request

Bypass the interceptor for specific requests:

```typescript
// Skip for login request
this.http.post('/api/login', credentials, {
  context: withSkipJwtInterceptor()
});

// Skip for refresh token request
this.http.post('/api/auth/refresh', {}, {
  context: withSkipJwtInterceptor()
});
```

## Examples

### Basic Setup

```typescript
export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
      withInterceptors([
        withJwtInterceptor({
          tokenGetter: () => localStorage.getItem('access_token')
        })
      ])
    )
  ]
};
```

### Domain Filtering

```typescript
withJwtInterceptor({
  tokenGetter: () => localStorage.getItem('token'),
  allowedDomains: [
    'api.example.com',
    'api-v2.example.com',
    /.*\.example\.com/  // Regex for subdomains
  ]
});
```

### Exclude Routes

```typescript
withJwtInterceptor({
  tokenGetter: () => localStorage.getItem('token'),
  skipUrls: [
    '/api/public',
    /\/api\/auth\/.*/  // Skip all auth routes
  ]
});
```

### Full Configuration

```typescript
withJwtInterceptor({
  tokenGetter: () => localStorage.getItem('access_token'),
  authScheme: 'Bearer ',
  headerName: 'Authorization',
  allowedDomains: ['api.example.com'],
  skipUrls: ['/api/public'],
  skipAddingIfExpired: true,
  errorOnNoToken: false,
  refreshTokenHandler: {
    refreshToken: () => this.authService.refresh().pipe(
      tap(token => localStorage.setItem('access_token', token))
    ),
    logout: () => {
      localStorage.clear();
      this.router.navigate(['/login']);
    }
  }
});
```
