
The `CacheService` is a versatile Angular service for efficient client-side caching, supporting multiple storage engines and advanced cache management features. It enables developers to store, retrieve, and manage data in memory, localStorage, or sessionStorage, with configurable expiration and versioning.

#### Key Features

- **Flexible Storage:** Choose between in-memory, localStorage, or sessionStorage for cache persistence.
- **Time-to-Live (TTL):** Set global or per-entry expiration to automatically invalidate stale data.
- **Versioning:** Associate cache entries with a version to ensure data consistency across deployments.
- **Cache Operations:** Easily set, get, check, remove, and clear cached values.
- **Customizable Prefix:** Optionally set a prefix for cache keys to avoid collisions.

#### Usage

1. **Provide the Service:** Register `CacheService` in your Angular module or component using `provideCacheService(options)`. Configure storage type, TTL, version, and key prefix as needed.
2. **Inject the Service:** Use Angular's dependency injection to access `CacheService` in your components or services.

#### Example

```typescript
import { Component, inject } from '@angular/core';
import { CacheService, provideCacheService } from '@ngx-oneforall/services';

@Component({
    selector: 'app-cache-demo',
    template: `
        <button (click)="setCache()">Set Cache</button>
        <button (click)="getCache()">Get Cache</button>
        <button (click)="removeCache()">Remove Cache</button>
        <button (click)="clearCache()">Clear All</button>
        <p>Cached Value: {{ cachedValue }}</p>
    `,
    providers: [provideCacheService({ storage: 'local', ttl: 60000, version: 'v1' })],
})
export class CacheDemoComponent {
    private readonly cacheService = inject(CacheService);
    cachedValue = '';

    setCache() {
        this.cacheService.set('user', 'JohnDoe');
    }

    getCache() {
        this.cachedValue = this.cacheService.get('user') ?? '';
    }

    removeCache() {
        this.cacheService.remove('user');
        this.cachedValue = '';
    }

    clearCache() {
        this.cacheService.clear();
        this.cachedValue = '';
    }
}
```

#### API Overview

- **`set<T>(key: string, value: T, config?: { ttl?: number; version?: string }): void`**  
    Stores a value in the cache with optional TTL and version.

- **`get<T>(key: string): T | null`**  
    Retrieves a cached value, or `null` if not found or expired.

- **`has(key: string): boolean`**  
    Checks if a valid cache entry exists for the given key.

- **`remove(key: string): void`**  
    Removes a specific cache entry.

- **`clear(): void`**  
    Clears all cache entries managed by the service.

#### Configuration Options

Customize cache behavior via `CacheOptions`:

- `storage`: `'memory' | 'local' | 'session'` (default: `'memory'`)
- `ttl`: number (global time-to-live in milliseconds, default: 1 hour)
- `version`: string (optional, for cache versioning)
- `storagePrefix`: string (optional, prefix for cache keys)

#### Notes

> **Warning**
> When a version mismatch is detected, all entries are automatically purged.

- The service is suitable for browser environments and supports both persistent and volatile caching.
- Use versioning to invalidate outdated cache after deployments or data schema changes.

#### Live Demo

Explore a live demonstration of cache service:

{{ NgDocActions.demo("CacheServiceDemoComponent") }}

