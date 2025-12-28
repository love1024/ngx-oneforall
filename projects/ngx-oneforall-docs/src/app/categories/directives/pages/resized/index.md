Detects element resize events using ResizeObserver and emits current/previous dimensions.

## Features

- **ResizeObserver API** — Efficient native resize detection
- **Previous Dimensions** — Tracks both current and previous size
- **Debounce Support** — Optional debouncing for rapid resize events
- **Zone Optimized** — Runs outside Angular zone for performance
- **SSR Safe** — Only activates in the browser

---

## Installation

```typescript
import { ResizedDirective, ResizedEvent } from '@ngx-oneforall/directives/resized';
```

---

## API Reference

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `debounceTime` | `number` | `0` | Debounce time in ms (0 = no debounce) |

| Output | Type | Description |
|--------|------|-------------|
| `resized` | `ResizedEvent` | Emits on size change |

### ResizedEvent

```typescript
interface ResizedEvent {
  current: DOMRectReadOnly;   // Current dimensions
  previous: DOMRectReadOnly | null;  // Previous dimensions
}
```

---

## Basic Usage

```html
<div (resized)="onResize($event)">
  Resizable content
</div>
```

```typescript
onResize(event: ResizedEvent) {
  console.log('Width:', event.current.width);
  console.log('Height:', event.current.height);
}
```

---

## With Debouncing

```html
<div (resized)="onResize($event)" [debounceTime]="100">
  Resizable content
</div>
```

---

## Common Use Cases

### Responsive Component

```typescript
@Component({
  template: `
    <div (resized)="onResize($event)">
      @if (isCompact()) {
        <span>Compact</span>
      } @else {
        <span>Full</span>
      }
    </div>
  `,
  imports: [ResizedDirective]
})
export class ResponsiveComponent {
  isCompact = signal(false);

  onResize(event: ResizedEvent) {
    this.isCompact.set(event.current.width < 400);
  }
}
```

### Size Display

```html
<div (resized)="size.set($event.current)" style="resize: both; overflow: auto;">
  Width: {{"{{ size().width }}"}} x Height: {{"{{ size().height }}"}}
</div>
```

---

## Live Demo

{{ NgDocActions.demoPane("ResizedDemoComponent") }}