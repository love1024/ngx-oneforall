Advanced caching service with TTL, versioning, and multi-storage support.

## Features

- **Multi-Storage** — Support for `memory`, `local`, and `session` storage
- **Time-to-Live (TTL)** — Auto-expiration for cached entries
- **Versioning** — Invalidate entire cache when version changes
- **SSR Safe** — Graceful fallback to memory on server
- **Type-Safe** — Generic support for stored values

---

## Installation

```typescript
import { 
  CacheService, 
  provideCacheService,
  CacheOptions 
} from '@ngx-oneforall/services/cache';
```

---

## Basic Usage

```typescript
import { Component, inject } from '@angular/core';
import { CacheService, provideCacheService } from '@ngx-oneforall/services/cache';

@Component({
  selector: 'app-demo',
  template: `<p>User: {{ '{' }}{{ '{' }} user() }}</p>`,
  providers: [
    provideCacheService({
      storage: 'local',
      ttl: 3600 * 1000, // 1 hour
      version: 'v1.0.0'
    })
  ]
})
export class DemoComponent {
  private cache = inject(CacheService);

  user = linkedSignal(() => {
    // Check cache first
    const cached = this.cache.get<User>('current_user');
    if (cached) return cached;
    
    // Fetch if missing
    return this.fetchUser();
  });

  saveUser(user: User) {
    this.cache.set('current_user', user);
  }
}
```

---

## API Reference

### `get<T>(key, storage?)`

Retrieve a value from cache. Returns `null` if missing or expired.

```typescript
// Get from default storage
const value = cache.get<string>('key');

// Get from specific storage
const memoryValue = cache.get<number>('count', 'memory');
```

### `set<T>(key, value, config?)`

Store a value with optional overrides.

```typescript
// Use global config
cache.set('user', user);

// Override TTL for this specific item (e.g. 5 seconds)
cache.set('temp', data, { ttl: 5000 });
```

### `has(key, storage?)`

Check if a valid (non-expired) entry exists.

```typescript
if (cache.has('token')) {
  // ...
}
```

### `remove(key, storage?)`

Remove a specific entry.

### `clear(storage?)`

Clear all entries managed by this service (respects prefix).

---

## Configuration Options

Pass these options to `provideCacheService()`:

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `storage` | `'memory' \| 'local' \| 'session'` | `'memory'` | Default storage engine |
| `ttl` | `number` | `3600000` (1h) | Global expiration time in ms |
| `version` | `string` | `INTERNAL` | Cache version string |
| `storagePrefix` | `string` | `undefined` | Key prefix in storage |

---

## Versioning & Invalidation

When you deploy a new version of your app, you often want to invalidate old cache entries to prevent schema mismatches.

```typescript
provideCacheService({
  version: 'v2.0.0', // Changing this invalidates all previous 'v1.0.0' entries
})
```

When `CacheService` detects a version mismatch for a key, it automatically removes that entry and returns `null`.

---

## Live Demo

{{ NgDocActions.demo("CacheServiceDemoComponent") }}
