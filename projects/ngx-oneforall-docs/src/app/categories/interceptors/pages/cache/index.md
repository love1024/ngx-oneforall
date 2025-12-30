The `withCacheInterceptor` caches HTTP responses to improve performance.

## Features

- **Two strategies** — Auto (all GETs) or manual (per-request)
- **Multiple storage** — Memory, localStorage, or sessionStorage
- **TTL support** — Configurable time-to-live
- **Version invalidation** — Bust cache on version change
- **SSR-safe** — Skips caching on server

## Installation

```typescript
import { withCacheInterceptor } from 'ngx-oneforall/interceptors/cache';
```

## Quick Start

```typescript
provideHttpClient(
  withInterceptors([
    withCacheInterceptor({ strategy: 'auto' })
  ])
);
```

## Configuration

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `strategy` | `'auto' \| 'manual'` | `'manual'` | Auto caches all GETs, manual requires context |
| `storage` | `'memory' \| 'local' \| 'session'` | `'memory'` | Default storage backend |
| `ttl` | `number` | `3600000` | Default TTL in milliseconds (1 hour) |
| `storagePrefix` | `string` | — | Key prefix for storage |
| `version` | `string` | — | Cache version for invalidation |
| `cacheBust` | `(req) => boolean \| void` | — | Function for cache invalidation. Return `true` to clear cache. |

## Strategies

### Auto Strategy

Caches all GET requests with JSON response type automatically:

```typescript
withCacheInterceptor({ strategy: 'auto' })
```

### Manual Strategy (Default)

Only caches requests with explicit context:

```typescript
import { useCache } from 'ngx-oneforall/interceptors/cache';

this.http.get('/api/data', {
  context: useCache()
});
```

## Cache Invalidation (Cache Bust)

You can provide a `cacheBust` function to implement custom cache invalidation logic. This function runs in the injection context, so you can use `inject()`. Return `true` to automatically clear the entire cache.

```typescript
withCacheInterceptor({
  cacheBust: (req) => {
    // Automatically clear cache on logout
    if (req.url.includes('/logout')) {
      return true;
    }
  }
})
```

## Per-Request Options

```typescript
this.http.get('/api/data', {
  context: useCache({
    enabled: true,
    key: 'custom-key',
    ttl: 60000,
    storage: 'session'
  })
});
```

| Option | Type | Description |
|--------|------|-------------|
| `enabled` | `boolean` | Enable/disable caching for this request |
| `key` | `string \| (req) => string` | Custom cache key |
| `ttl` | `number` | TTL override for this request |
| `storage` | `'memory' \| 'local' \| 'session'` | Storage override |

## Dynamic Cache Keys

```typescript
this.http.get('/api/users', {
  context: useCache({
    key: req => `users-${req.params.get('page')}`
  })
});
```

## Demo

{{ NgDocActions.demo("CacheInterceptorServiceComponent") }}