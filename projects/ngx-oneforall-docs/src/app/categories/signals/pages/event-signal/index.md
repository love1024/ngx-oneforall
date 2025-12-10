`eventSignal` creates a reactive `Signal` from a DOM event. It automatically handles event listener cleanup and Angular Zone execution.

## Usage

Use `eventSignal` to track events on a DOM element. It must be called within an **injection context** (e.g., constructor or field initializer).


### Basic Example

```typescript
import { eventSignal } from '@ngx-oneforall/signals';

@Component({ ... })
export class MyComponent {
    // Create a signal from click events on document
    clickSignal = eventSignal(document, 'click');
}
```

> **Note**
> The signal returns `null` initially until the first event fires.

> **Important**
> `eventSignal` uses `inject()` internally, so it must be called during component construction. If you need to attach to an element that is not available yet (like a `viewChild`), you might need to use `runInInjectionContext` in `ngAfterViewInit` or use the host element.

## API

`eventSignal<T = Event>(target: EventTarget, eventName: string, options?: AddEventListenerOptions): WritableSignal<T | null>`

- **target**: The DOM element or EventTarget to listen to.
- **eventName**: The name of the event (e.g., 'click', 'mousemove').
- **options**: Optional `AddEventListenerOptions` (e.g., `{ capture: true }`).

## Demo


{{ NgDocActions.demo("EventSignalDemoComponent", { container: true }) }}
