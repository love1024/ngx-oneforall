
`intervalSignal` creates a controllable interval timer that updates a signal. It handles Angular Zone execution efficiently by running the timer outside Angular and only updating the signal inside.

## Usage

Use `intervalSignal` to create a timer. It returns an `IntervalController` object with signals for the current value and running state, and methods to start and stop the timer.

{{ NgDocActions.demo("IntervalSignalDemoComponent", { container: true }) }}

### Basic Example

```typescript
import { intervalSignal } from '@ngx-oneforall/signals';

@Component({ ... })
export class MyComponent {
    // Create an interval that ticks every 1000ms
    interval = intervalSignal(1000);

    constructor() {
        effect(() => {
            // Update automatically when interval changes
            console.log(this.interval.value());
        })
    }

    start() {
        this.interval.start();
    }

    stop() {
        this.interval.stop();
    }
}
```

### API

`intervalSignal(ms: number): IntervalController`

- **ms**: The interval duration in milliseconds.

### IntervalController

The returned object contains:

- **value**: `WritableSignal<number>` - The current count (starts at 0).
- **running**: `WritableSignal<boolean>` - Whether the interval is currently active.
- **start()**: Starts the interval.
- **stop()**: Stops the interval.

> **Note**
> The interval automatically cleans up when the component or injection context is destroyed.
