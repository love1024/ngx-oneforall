![Bundle Size](https://deno.bundlejs.com/badge?q=ngx-oneforall/decorators/throttle&treeshake=[*]&config={"esbuild":{"external":["rxjs","@angular/core","@angular/common","@angular/forms","@angular/router"]}})

The `throttle` decorator limits method execution to once per delay period. Unlike debounce, it executes immediately.

### Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `delay` | `number` | `300` | Delay in milliseconds |
| `leading` | `boolean` | `true` | Execute on leading edge |
| `trailing` | `boolean` | `false` | Execute on trailing edge |

### Features

- **Leading edge** - Executes immediately (default)
- **Trailing edge** - Optional execution after delay
- **Per-instance** - Separate throttle state per instance
- **Cached return** - Returns last result during throttle period

### Basic Usage

```typescript
import { throttle } from 'ngx-oneforall/decorators/throttle';

@throttle(500)
handleScroll() {
  // Executes at most once per 500ms
}
```

### With Trailing Edge

```typescript
@throttle({ delay: 500, trailing: true })
savePosition() {
  // Executes on first call AND after 500ms with latest args
}
```

### Trailing Only

```typescript
@throttle({ delay: 1000, leading: false, trailing: true })
batchUpdates() {
  // Waits 1000ms, then executes with latest args
}
```

### Use Cases

- Scroll event handlers
- Window resize handlers
- Rate-limiting API calls
- Preventing double-clicks

### Live Demonstration

{{ NgDocActions.demo("ThrottleDemoComponent") }}
