`routerEventSignal` creates a reactive signal that tracks Angular Router events. It provides easy access to the current router event and helpers for common navigation states.

## Usage

Use `routerEventSignal` to react to navigation changes. It returns an object with signals for the current event and computed signals for navigation start/end states.

{{ NgDocActions.demo("RouterEventSignalDemoComponent", { container: true }) }}

### Basic Example

```typescript
import { routerEventSignal } from '@ngx-oneforall/signals';

@Component({ ... })
export class MyComponent {
    // Track router events
    router = routerEventSignal();

    constructor() {
        effect(() => {
            if (this.router.isNavigationEnd()) {
                console.log('Navigation finished!');
            }
        });
    }
}
```

## API

`routerEventSignal()`

Returns an object with:

- **event**: `Signal<RouterEvent | null>` - The most recent router event.
- **isNavigationStart**: `Signal<boolean>` - True if the last event was `NavigationStart`.
- **isNavigationEnd**: `Signal<boolean>` - True if the last event was `NavigationEnd`.

> **Note**
> The signal automatically cleans up its subscription when the component or injection context is destroyed.
