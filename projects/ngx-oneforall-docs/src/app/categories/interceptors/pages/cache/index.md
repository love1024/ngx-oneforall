The `cacheInterceptor` is an Angular HTTP interceptor that transparently caches HTTP responses for GET requests, improving performance and reducing unnecessary network calls. It is highly configurable and integrates seamlessly with Angular's HTTP client.

## Why Use a Cache Interceptor?

Caching HTTP responses can significantly improve the speed and efficiency of your application by avoiding repeated requests for the same data. The `cacheInterceptor` automates this process, allowing you to control which requests are cached, for how long, and in which storage engine (memory, localStorage, or sessionStorage).

## How to use
Register the interceptor and `CacheService` in your Angular application's providers:

> **Alert**
> [CacheService](/services/cache) (`@ngx-oneforall/services`) is a required dependency for the CacheInterceptor. Make sure to provide it in your application.

```typescript
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { withCacheInterceptor } from '@ngx-oneforall/interceptors';
import { provideCacheService } from '@ngx-oneforall/services';

@NgModule({
  providers: [
     provideCacheService(),,
    { provide: HTTP_INTERCEPTORS, useValue: withCacheInterceptor(), multi: true }
  ]
})
export class AppModule {}
```

or provide it in app configuration:

```typescript
export const appConfig: ApplicationConfig = {
  providers: [
    provideCacheService(),
    provideHttpClient(
      withInterceptors([withCacheInterceptor()])
    ),
  ],
};
```
## Strategies
The `cacheInterceptor` supports two main caching strategies:

### 1. Manual (Default)

By default, the interceptor does **not** cache any requests unless explicitly instructed. To cache a specific request, provide the `useCache` context:

```typescript
this.http.get<Todo[]>('https://jsonplaceholder.typicode.com/todos', {
  context: useCache(),
});
```

This approach gives you fine-grained control over which requests are cached.

### 2. Auto

With the **auto** strategy enabled, the interceptor automatically caches all GET requests that expect a JSON response. No additional context is required—caching happens transparently for all eligible requests.

You can enable the auto strategy via configuration when registering the interceptor:

```typescript
withCacheInterceptor('auto')
```

Choose the strategy that best fits your application's needs for flexibility or convenience.

## Options
You can customize caching behavior for individual requests by passing options to the `useCache` context. These options override the global settings of the cache service for that specific request:

> **Alert**
> By default, the global settings of cache service are used.


| Option        | Type                                                  | Description                                                                                                  |
|--------------|-------------------------------------------------------|--------------------------------------------------------------------------------------------------------------|
| enabled      | `boolean`                                             | Enables or disables caching for this request. Set to `false` to bypass cache even if globally enabled.       |
| key          | `string` or `(req: HttpRequest<unknown>) => string`   | Custom cache key for this request. Useful for differentiating cache entries or dynamic key generation.        |
| context      | `HttpContext`                                         | Allows passing a custom `HttpContext` for advanced scenarios.                                                |
| storage      | `'memory' \| 'localStorage' \| 'sessionStorage'`      | Selects the storage engine for this request's cache. Overrides the global storage setting.                   |
| ttl          | `number`                                              | Time-to-live for the cache entry in milliseconds. Overrides the global TTL for this request.                 |
| storagePrefix| `string`                                              | Custom prefix for cache keys in storage. Useful for namespacing or versioning cache entries.                 |
| version      | `string`                                              | Version identifier for the cache entry. Changing the version will invalidate previous cache entries.         |

**Example:**

```typescript
this.http.get<Todo[]>('https://api.example.com/todos', {
  context: useCache({
    enabled: true,
    key: (req) => `todos-${req.params.get('userId')}`,
    ttl: 3600
  }),
});
```

This flexibility lets you fine-tune caching on a per-request basis.

## Demo

Explore a live demonstration of cache interceptor:

{{ NgDocActions.demo("CacheInterceptorServiceComponent") }}