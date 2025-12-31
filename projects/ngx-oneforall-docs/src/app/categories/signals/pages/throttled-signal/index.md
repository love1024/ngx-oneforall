![Bundle Size](https://deno.bundlejs.com/badge?q=ngx-oneforall/signals/throttled-signal&treeshake=[*]&config={"esbuild":{"external":["rxjs","@angular/core","@angular/common","@angular/forms","@angular/router"]}})

`throttledSignal` creates a read-only signal that limits how often the source signal's updates are emitted. It ensures updates occur at most once per specified interval, regardless of how frequently the source changes.

## Usage

Use `throttledSignal` when you need to limit the rate of updates from high-frequency events like scroll, mousemove, or resize.

{{ NgDocActions.demo("ThrottledSignalDemoComponent", { container: true }) }}

### Basic Example

```typescript
import { signal } from '@angular/core';
import { throttledSignal } from 'ngx-oneforall/signals/throttled-signal';

@Component({ ... })
export class MouseTrackerComponent {
    coords = signal('0, 0');
    
    // Updates at most once every 100ms
    throttledCoords = throttledSignal(this.coords, 100);
    
    onMouseMove(event: MouseEvent) {
        this.coords.set(`${event.clientX}, ${event.clientY}`);
    }
}
```

## API

`throttledSignal<T>(source: Signal<T>, delay: number): Signal<T>`

| Parameter | Type | Description |
|-----------|------|-------------|
| `source` | `Signal<T>` | The source signal to throttle |
| `delay` | `number` | Minimum interval between updates (ms) |

Returns a read-only signal that updates at most once per `delay` interval.

> **Note**
> The internal timer is automatically cleaned up when the injection context is destroyed.

## Debounce vs Throttle

| Behavior | `debouncedSignal` | `throttledSignal` |
|----------|-------------------|-------------------|
| **When it emits** | After source stops changing | At regular intervals |
| **Use case** | Wait for input to settle | Rate-limit frequent updates |
| **Example** | Search input | Scroll position tracking |

## When to Use

✅ **Good use cases:**
- Scroll event handling
- Mouse movement tracking
- Window resize handlers
- Progress updates

❌ **Avoid when:**
- You need to wait for input to settle (use `debouncedSignal`)
- You need immediate response to every change
