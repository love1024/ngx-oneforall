Implements infinite scroll behavior using IntersectionObserver for efficient detection.

## Features

- **IntersectionObserver** — No scroll event listeners, better performance
- **Reactive** — Automatically reinitializes when inputs change
- **Flexible Container** — Works with window, custom container, or auto-detects parent
- **Configurable Threshold** — Control trigger distance via `bottomMargin`
- **SSR Safe** — Only activates in the browser

---

## Installation

```typescript
import { InfiniteScrollDirective } from '@ngx-oneforall/directives/infinite-scroll';
```

---

## Basic Usage

```html
<!-- Window scrolling (default) -->
<div infiniteScroll (scrolled)="loadMore()">
  @for (item of items(); track item.id) {
    <div>{{ item.name }}</div>
  }
</div>
```

---

## API Reference

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `bottomMargin` | `number` | `20` | Distance (%) from bottom to trigger |
| `useWindow` | `boolean` | `true` | Use window vs container scroll |
| `scrollContainer` | `string` | `null` | CSS selector for custom container |
| `disabled` | `boolean` | `false` | Disable scroll detection |
| `checkOnInit` | `boolean` | `true` | Emit on initial render if visible |
| `initDelay` | `number` | `1000` | Delay (ms) to ignore initial intersections |

| Output | Type | Description |
|--------|------|-------------|
| `scrolled` | `void` | Emits when scroll reaches threshold |

---

## Container Scrolling

For a specific scrollable container:

```html
<div 
  class="scroll-container" 
  infiniteScroll 
  [useWindow]="false"
  [scrollContainer]="'.scroll-container'"
  (scrolled)="loadMore()">
  <!-- Items -->
</div>
```

---

## Common Use Cases

### Paginated List

```typescript
@Component({
  template: `
    <div infiniteScroll (scrolled)="loadNextPage()" [disabled]="loading()">
      @for (item of items(); track item.id) {
        <app-item [data]="item" />
      }
      @if (loading()) {
        <div class="spinner">Loading...</div>
      }
    </div>
  `,
  imports: [InfiniteScrollDirective]
})
export class ListComponent {
  items = signal<Item[]>([]);
  loading = signal(false);
  page = 0;

  loadNextPage() {
    this.loading.set(true);
    this.api.getItems(++this.page).subscribe(newItems => {
      this.items.update(items => [...items, ...newItems]);
      this.loading.set(false);
    });
  }
}
```

---

## Live Demo

{{ NgDocActions.demoPane("InfiniteScrollDemoComponent") }}
