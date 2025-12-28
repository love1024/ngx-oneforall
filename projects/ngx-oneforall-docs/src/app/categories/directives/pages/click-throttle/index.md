Throttles click events to prevent accidental double-clicks and rapid repeated interactions.

## Features

- **Immediate Response** — First click fires instantly (leading edge)
- **Configurable Delay** — Set throttle interval via `throttleTime` input
- **Reactive** — Updates throttle duration when input changes
- **SSR Safe** — Only activates in the browser

---

## Installation

```typescript
import { ClickThrottleDirective } from '@ngx-oneforall/directives/click-throttle';
```

---

## Basic Usage

```html
<!-- Default 1000ms throttle -->
<button (clickThrottle)="submit()">Submit</button>

<!-- Custom 500ms throttle -->
<button [throttleTime]="500" (clickThrottle)="submit()">Submit</button>
```

---

## API Reference

| Input/Output | Type | Default | Description |
|--------------|------|---------|-------------|
| `throttleTime` | `number` | `1000` | Minimum interval (ms) between emissions |
| `clickThrottle` | `OutputEmitterRef<Event>` | — | Emits throttled click events |

---

## How It Works

```
User clicks:    ●──●●●●──────────●●●──────●
                0  200           1500      2800 (ms)

With 1000ms throttle:
Emits:          ●─────────────────●────────●
                0                 1500     2800
```

- First click in each window is emitted immediately
- Subsequent clicks within the throttle period are ignored

---

## Common Use Cases

### Prevent Double Submit

```html
<button [throttleTime]="2000" (clickThrottle)="submitForm()">
  Submit Order
</button>
```

### API Request Protection

```typescript
@Component({
  template: `<button (clickThrottle)="loadMore()">Load More</button>`,
  imports: [ClickThrottleDirective]
})
export class ListComponent {
  loadMore() {
    this.api.fetchNextPage(); // Won't fire more than once per second
  }
}
```

---

## Live Demo

{{ NgDocActions.demoPane("ClickThrottleDemoComponent") }}
