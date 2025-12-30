`debouncedSignal` creates a read-only signal that delays updates until the source signal stops changing for a specified duration. Ideal for search inputs, form validation, and window resize handling.

## Usage

Use `debouncedSignal` to wait for rapid changes to settle before reacting.

{{ NgDocActions.demo("DebouncedSignalDemoComponent", { container: true }) }}

### Basic Example

```typescript
import { signal } from '@angular/core';
import { debouncedSignal } from 'ngx-oneforall/signals/debounced-signal';

@Component({ ... })
export class SearchComponent {
    searchTerm = signal('');
    
    // Updates only after user stops typing for 500ms
    debouncedTerm = debouncedSignal(this.searchTerm, 500);
    
    constructor() {
        effect(() => {
            const term = this.debouncedTerm();
            if (term) {
                this.performSearch(term);
            }
        });
    }
}
```

## API

`debouncedSignal<T>(source: Signal<T>, delay: number): Signal<T>`

| Parameter | Type | Description |
|-----------|------|-------------|
| `source` | `Signal<T>` | The source signal to debounce |
| `delay` | `number` | Delay in milliseconds |

Returns a read-only signal that reflects the source value after the delay.

> **Note**
> The internal timer is automatically cleaned up when the injection context is destroyed.

## When to Use

✅ **Good use cases:**
- Search input with API calls
- Form validation on change
- Window resize handlers
- Auto-save functionality

❌ **Avoid when:**
- You need immediate response
- You want rate limiting instead (use `throttledSignal`)
