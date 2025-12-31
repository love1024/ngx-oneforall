![Bundle Size](https://deno.bundlejs.com/badge?q=ngx-oneforall/directives/visibility-change&treeshake=[*]&config={"esbuild":{"external":["rxjs","@angular/core","@angular/common","@angular/forms","@angular/router"]}})

Detects when an element enters or leaves the viewport using IntersectionObserver.

## Features

- **Visibility Detection** — Emits when element becomes visible/hidden
- **Configurable Threshold** — Control visibility percentage to trigger
- **Custom Root** — Observe within viewport or custom container
- **Root Margin** — Adjust intersection area with margin
- **Zone Optimized** — Observer runs outside Angular zone
- **SSR Safe** — Only activates in the browser

---

## Installation

```typescript
import { VisibilityChangeDirective, VisibilityChange } from 'ngx-oneforall/directives/visibility-change';
```

---

## API Reference

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `threshold` | `number` | `1.0` | Visibility % to trigger (0-1) |
| `root` | `HTMLElement \| null` | `null` | Custom scroll container |
| `rootMargin` | `string` | `'0px'` | Margin around root |

| Output | Type | Description |
|--------|------|-------------|
| `visibilityChange` | `VisibilityChange` | Emits on visibility change |

### VisibilityChange Type

```typescript
type VisibilityChange = 
  | { isVisible: true; target: HTMLElement }
  | { isVisible: false; target: HTMLElement | undefined };
```

---

## Basic Usage

```html
<div (visibilityChange)="onVisible($event)">
  Watch me!
</div>
```

```typescript
onVisible(event: VisibilityChange) {
  if (event.isVisible) {
    console.log('Element is visible');
  }
}
```

---

## Common Use Cases

### Lazy Load Content

```typescript
@Component({
  template: `
    <div (visibilityChange)="onVisible($event)" [threshold]="0.1">
      @if (loaded()) {
        <heavy-component />
      } @else {
        <div class="placeholder">Loading...</div>
      }
    </div>
  `,
  imports: [VisibilityChangeDirective]
})
export class LazyComponent {
  loaded = signal(false);

  onVisible(event: VisibilityChange) {
    if (event.isVisible && !this.loaded()) {
      this.loaded.set(true);
    }
  }
}
```

### Animate on Scroll

```html
<div 
  (visibilityChange)="visible.set($event.isVisible)"
  [threshold]="0.5"
  [class.animate-in]="visible()">
  Animated content
</div>
```

---

## Live Demo

{{ NgDocActions.demoPane("VisibilityChangeDemoComponent") }}
