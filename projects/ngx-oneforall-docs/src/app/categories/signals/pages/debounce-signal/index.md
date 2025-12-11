`debouncedSignal` creates a signal that updates its value only after a specified delay has passed since the last change in the source signal. This is useful for handling rapid updates like search inputs or window resizing.

## Usage

Use `debouncedSignal` when you want to delay reactions to a signal's changes until the changes have settled.

{{ NgDocActions.demo("DebouncedSignalDemoComponent", { container: true }) }}

### Basic Example

```typescript
import { signal } from '@angular/core';
import { debouncedSignal } from '@ngx-oneforall/signals';

@Component({ ... })
export class MyComponent {
    searchTerm = signal('');
    // Updates only after user stops typing for 500ms
    debouncedTerm = debouncedSignal(this.searchTerm, 500);
}
```

## API

`debouncedSignal<T>(source: Signal<T>, delay: number): Signal<T>`

- **source**: The source signal to debounce.
- **delay**: The delay in milliseconds.

Returns a read-only signal that reflects the source value after the delay.

> **Note**
> The internal timer is automatically cleaned up when the component or injection context is destroyed.
