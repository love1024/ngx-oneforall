![Bundle Size](https://deno.bundlejs.com/badge?q=ngx-oneforall/decorators/debounce&treeshake=[*]&config={"esbuild":{"external":["rxjs","@angular/core","@angular/common","@angular/forms","@angular/router"]}})

The `debounce` decorator delays method execution until a specified time has passed since the last call. Supports leading/trailing edge execution.

### Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `options` | `number \| DebounceOptions` | `300` | Delay in ms or options object |
| `options.delay` | `number` | `300` | Delay in milliseconds |
| `options.leading` | `boolean` | `false` | Execute on first call (leading edge) |

### Features

- **Trailing edge** (default): Executes after delay elapses
- **Leading edge**: Executes immediately on first call
- **Return value caching**: Returns last result from original method
- **Instance isolation**: Each instance has its own debounced state

### Basic Usage

```typescript
@debounce(300)
onInputChange(event: Event): void {
  this.value = (event.target as HTMLInputElement).value;
}
```

### Leading Edge

Execute immediately on first call, then debounce:

```typescript
@debounce({ delay: 300, leading: true })
onButtonClick(): void {
  this.performAction();
}
```

### With Options Object

```typescript
@debounce({ delay: 500, leading: false })
onScroll(): void {
  this.updateScrollPosition();
}
```

### Comparison

| Mode | First Call | During Delay | After Delay |
|------|------------|--------------|-------------|
| `leading: false` | Schedules | Resets timer | Executes |
| `leading: true` | Executes | Resets timer | Resets state |

### Live Demonstration

{{ NgDocActions.demo("DebounceDemoComponent") }}
