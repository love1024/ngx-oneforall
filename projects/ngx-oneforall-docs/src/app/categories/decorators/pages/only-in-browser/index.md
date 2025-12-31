![Bundle Size](https://deno.bundlejs.com/badge?q=ngx-oneforall/decorators/only-in-browser&treeshake=[*]&config={"esbuild":{"external":["rxjs","@angular/core","@angular/common","@angular/forms","@angular/router"]}})

The `OnlyInBrowser` decorator ensures methods only execute in browser environment, not during SSR.

### Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `fallback` | `T` | `undefined` | Value to return when not in browser |

### Features

- **SSR-safe** - Prevents browser-specific code from running on server
- **Fallback support** - Return custom value during SSR
- **Zero config** - Works without options for void methods

### Basic Usage

```typescript
import { OnlyInBrowser } from 'ngx-oneforall/decorators/only-in-browser';

@OnlyInBrowser()
initLocalStorage(): void {
  localStorage.setItem('initialized', 'true');
}
```

### With Fallback

```typescript
@OnlyInBrowser({ fallback: [] })
getFromStorage(): string[] {
  return JSON.parse(localStorage.getItem('items') || '[]');
}
// Returns [] during SSR instead of undefined
```

### Observable Fallback

```typescript
@OnlyInBrowser({ fallback: of([]) })
getBrowserData(): Observable<Data[]> {
  // Uses browser-only APIs
}
// Returns of([]) during SSR
```

### Use Cases

- Accessing `window` or `document`
- DOM manipulation
- Browser storage (localStorage, sessionStorage)
- Browser-only libraries

### Live Demonstration

{{ NgDocActions.demo("OnlyInBrowserDemoComponent") }}
