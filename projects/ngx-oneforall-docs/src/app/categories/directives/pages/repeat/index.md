A structural directive that repeats a template a specified number of times.

## Features

- **Reactive** — Re-renders when count changes
- **Rich Context** — Exposes index, first, last, even, odd
- **Safe** — Handles negative numbers gracefully

---

## Installation

```typescript
import { RepeatDirective } from '@ngx-oneforall/directives/repeat';
```

---

## API Reference

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `repeat` | `number` | `1` | Number of times to repeat |

### Context Variables

| Variable | Type | Description |
|----------|------|-------------|
| `$implicit` | `number` | Current index (0-based) |
| `index` | `number` | Same as `$implicit` |
| `first` | `boolean` | True if first iteration |
| `last` | `boolean` | True if last iteration |
| `even` | `boolean` | True if index is even |
| `odd` | `boolean` | True if index is odd |

---

## Basic Usage

```html
<div *repeat="5; let i">
  Item {{ i }}
</div>
```

---

## Using Context Variables

```html
<div *repeat="3; let i; let isFirst = first; let isLast = last; let isEven = even">
  <span>Index: {{ i }}</span>
  <span *ngIf="isFirst">← First</span>
  <span *ngIf="isLast">← Last</span>
  <span *ngIf="isEven">← Even</span>
</div>
```

---

## Common Use Cases

### Star Rating

```html
<span *repeat="5; let i">
  ★
</span>
```

### Skeleton Loaders

```html
<div *repeat="3" class="skeleton-row"></div>
```

### Pagination Dots

```html
<span *repeat="pageCount; let i" 
      [class.active]="i === currentPage"
      (click)="goToPage(i)">
  ●
</span>
```

---

## Live Demo

{{ NgDocActions.demoPane("RepeatDemoComponent") }}
