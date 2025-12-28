`routerEventSignal` creates a reactive signal that tracks Angular Router events. It provides easy access to the current event and computed helpers for common navigation states.

## Usage

Use `routerEventSignal` to react to navigation changes with Angular signals.

{{ NgDocActions.demo("RouterEventSignalDemoComponent", { container: true }) }}

### Basic Example

```typescript
import { routerEventSignal } from '@ngx-oneforall/signals/router-event-signal';

@Component({ ... })
export class NavigationComponent {
    router = routerEventSignal();
    
    constructor() {
        effect(() => {
            if (this.router.isNavigationEnd()) {
                console.log('Navigation complete!');
                this.trackPageView();
            }
        });
    }
}
```

### Loading Indicator

```typescript
@Component({
    template: `
        @if (router.isNavigationStart()) {
            <div class="loading">Loading...</div>
        }
    `
})
export class AppComponent {
    router = routerEventSignal();
}
```

## API

`routerEventSignal(): RouterEventState`

### RouterEventState

The returned object provides:

| Property | Type | Description |
|----------|------|-------------|
| `event` | `Signal<RouterEvent \| null>` | Most recent router event |
| `isNavigationStart` | `Signal<boolean>` | True during navigation start |
| `isNavigationEnd` | `Signal<boolean>` | True after navigation completes |

> **Note**
> The subscription is automatically cleaned up when the injection context is destroyed.

## When to Use

✅ **Good use cases:**
- Loading indicators during navigation
- Analytics/page view tracking
- Navigation guards with signals
- Scroll position restoration

❌ **Avoid when:**
- You need detailed route data (use `ActivatedRoute`)
- You need to prevent navigation (use route guards)
