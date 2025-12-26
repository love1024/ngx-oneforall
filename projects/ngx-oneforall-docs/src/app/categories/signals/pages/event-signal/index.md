`eventSignal` creates a reactive signal from DOM events. It automatically handles event listener setup, cleanup, and Angular zone execution.

## Usage

Use `eventSignal` to track DOM events reactively. Must be called within an injection context.

{{ NgDocActions.demo("EventSignalDemoComponent", { container: true }) }}

### Basic Example

```typescript
import { eventSignal } from '@ngx-oneforall/signals/event-signal';

@Component({ ... })
export class ClickTrackerComponent {
    // Track clicks on the document
    clickEvent = eventSignal(document, 'click');
    
    constructor() {
        effect(() => {
            const event = this.clickEvent();
            if (event) {
                console.log('Clicked at:', event.clientX, event.clientY);
            }
        });
    }
}
```

### With Element Reference

```typescript
@Component({
    template: `<button #btn>Click me</button>`
})
export class MyComponent {
    private elementRef = inject(ElementRef);
    
    // Listen on host element
    hostClick = eventSignal(this.elementRef.nativeElement, 'click');
}
```

## API

`eventSignal<T = Event>(target: EventTarget, eventName: string, options?: AddEventListenerOptions): WritableSignal<T | null>`

| Parameter | Type | Description |
|-----------|------|-------------|
| `target` | `EventTarget` | DOM element or EventTarget to listen on |
| `eventName` | `string` | Event name (e.g., 'click', 'mousemove') |
| `options` | `AddEventListenerOptions` | Optional listener options |

Returns a writable signal that holds the latest event, or `null` before first event.

> **Note**
> Must be called in an injection context (constructor, field initializer). For elements not available at construction (like `viewChild`), use `runInInjectionContext` in `ngAfterViewInit`.

## When to Use

✅ **Good use cases:**
- Mouse/touch tracking
- Keyboard shortcuts
- Scroll position monitoring
- Custom drag-and-drop

❌ **Avoid when:**
- Using Angular's built-in event binding is sufficient
- You need complex event composition (use RxJS `fromEvent`)
