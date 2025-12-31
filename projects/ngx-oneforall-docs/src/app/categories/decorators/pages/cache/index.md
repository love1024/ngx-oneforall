![Bundle Size](https://deno.bundlejs.com/badge?q=ngx-oneforall/decorators/cache&treeshake=[*]&config={"esbuild":{"external":["rxjs","@angular/core","@angular/common","@angular/forms","@angular/router"]}})

The `Cache` decorator caches Observable method results with configurable storage, TTL, and versioning.

> **Note**
> **When to use:** Use `@Cache` for Observable methods. For sync or Promise methods, use [`@memoize`](/decorators/memoize) instead.

### Parameters

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `storage` | `'memory' \| 'local' \| 'session'` | `'memory'` | Storage backend |
| `storageKey` | `string` | `'CACHE_DECORATOR'` | Storage key for cache data |
| `ttl` | `number \| null` | `null` | Time-to-live in ms (`null` = no expiration) |
| `itemCacheKey` | `string` | Auto | Custom cache key for method |
| `maxItems` | `number \| null` | `null` | Max cached items (`null` = unlimited) |
| `version` | `string` | — | Cache version (change clears cache) |
| `cacheKeyMatcher` | `Function` | Deep compare | Custom param comparison |
| `cacheKeySelector` | `Function` | All params | Select params for cache key |

### Features

- **Multi-storage**: Memory, localStorage, sessionStorage
- **TTL expiration**: Auto-invalidate stale entries
- **Version control**: Clear cache on version change
- **Request deduplication**: Concurrent calls share same Observable
- **LRU eviction**: Limit cache size with `maxItems`
- **Error handling**: Failed requests are NOT cached

### Basic Usage

```typescript
@Injectable({ providedIn: 'root' })
export class UserService {
  @Cache({ ttl: 60000 })
  getUser(id: number): Observable<User> {
    return this.http.get<User>(`/api/users/${id}`);
  }
}
```

### With Storage & Max Items

```typescript
@Cache({ storage: 'local', maxItems: 10, ttl: 300000 })
searchUsers(query: string): Observable<User[]> {
  return this.http.get<User[]>(`/api/users?q=${query}`);
}
```

### Version Control

```typescript
@Cache({ version: '2.0.0', storage: 'session' })
getConfig(): Observable<Config> {
  return this.http.get<Config>('/api/config');
}
```

Changing `version` clears all cached data for this method.

### Custom Cache Key

```typescript
// Only use first param as cache key
@Cache({
  cacheKeySelector: (params) => params[0],
})
getData(id: number, timestamp: Date): Observable<Data> {
  return this.http.get<Data>(`/api/data/${id}`);
}
```

### Live Demonstration

{{ NgDocActions.demo("CacheDecoratorComponent") }}
