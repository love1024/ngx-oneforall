`throttledSignal` creates a signal that limits the rate at which the source signal's updates are emitted. It ensures the signal value updates at most once every specified `delay` milliseconds.

## Usage

Use `throttledSignal` when you want to handle frequent updates (like scroll events or mouse movements) without overwhelming your application or causing excessive re-rendering.

{{ NgDocActions.demo("ThrottledSignalDemoComponent", { container: true }) }}

### Basic Example

```typescript
import { signal } from '@angular/core';
import { throttledSignal } from '@ngx-oneforall/signals';

@Component({ ... })
export class MyComponent {
    coords = signal('0, 0');
    // Updates at most once every 500ms
    throttledCoords = throttledSignal(this.coords, 500);
}
```

## API

`throttledSignal<T>(source: Signal<T>, delay: number): Signal<T>`

- **source**: The source signal to throttle.
- **delay**: The throttling interval in milliseconds.

Returns a read-only signal that updates at most once per `delay` interval.

> **Note**
> The internal timer is automatically cleaned up when the component or injection context is destroyed.
