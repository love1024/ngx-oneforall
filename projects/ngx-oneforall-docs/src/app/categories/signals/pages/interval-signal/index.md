![Bundle Size](https://deno.bundlejs.com/badge?q=ngx-oneforall/signals/interval-signal&treeshake=[*]&config={"esbuild":{"external":["rxjs","@angular/core","@angular/common","@angular/forms","@angular/router"]}})

`intervalSignal` creates a controllable interval timer that updates a signal. It runs the timer outside Angular's zone for performance and only triggers change detection when updating the signal.

## Usage

Use `intervalSignal` to create timers, countdowns, or periodic updates with start/stop control.

{{ NgDocActions.demo("IntervalSignalDemoComponent", { container: true }) }}

### Basic Example

```typescript
import { intervalSignal } from 'ngx-oneforall/signals/interval-signal';

@Component({ ... })
export class TimerComponent {
    // Ticks every 1000ms (1 second)
    timer = intervalSignal(1000);
    
    constructor() {
        effect(() => {
            console.log('Tick:', this.timer.value());
        });
    }
    
    start() {
        this.timer.start();
    }
    
    stop() {
        this.timer.stop();
    }
}
```

## API

`intervalSignal(ms: number): IntervalController`

| Parameter | Type | Description |
|-----------|------|-------------|
| `ms` | `number` | Interval duration in milliseconds |

### IntervalController

The returned object provides:

| Property/Method | Type | Description |
|-----------------|------|-------------|
| `value` | `WritableSignal<number>` | Current tick count (starts at 0) |
| `running` | `WritableSignal<boolean>` | Whether the timer is active |
| `start()` | `() => void` | Starts the interval |
| `stop()` | `() => void` | Stops the interval |

> **Note**
> The interval automatically cleans up when the injection context is destroyed.

## When to Use

✅ **Good use cases:**
- Countdown timers
- Auto-refresh data polling
- Animation frame timing
- Session timeout warnings

❌ **Avoid when:**
- You need one-time delays (use `setTimeout`)
- You're polling an API (use RxJS `timer` with HTTP)
