Dynamically applies CSS classes on hover with reactive updates and toggle support.

## Features

- **Multiple Classes** — Apply one or more space-separated classes
- **Toggleable** — Enable/disable via `hoverClassEnabled` input
- **Auto Cleanup** — Classes removed automatically when disabled
- **SSR Safe** — Only activates in the browser

---

## Installation

```typescript
import { HoverClassDirective } from '@ngx-oneforall/directives/hover-class';
```

---

## Basic Usage

```html
<!-- Single class -->
<button hoverClass="highlight">Hover me</button>

<!-- Multiple classes -->
<div hoverClass="shadow-lg border-primary">Hover card</div>

<!-- Conditional enable -->
<span hoverClass="underline" [hoverClassEnabled]="isActive()">Link</span>
```

---

## API Reference

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `hoverClass` | `string` | *required* | Space-separated CSS classes to apply on hover |
| `hoverClassEnabled` | `boolean` | `true` | Enables/disables the hover effect |

---

## Behavior

| State | Action |
|-------|--------|
| Mouse enter (enabled) | Adds all specified classes |
| Mouse leave (enabled) | Removes all specified classes |
| `hoverClassEnabled=false` | Immediately removes any applied classes |
| `hoverClass` changes | Updates classes to toggle on next hover |

---

## Common Use Cases

### Button Hover Effect

```html
<button hoverClass="bg-primary text-white scale-105">
  Submit
</button>
```

### Card Hover Shadow

```typescript
@Component({
  template: `
    <div class="card" hoverClass="shadow-xl transform-up">
      {{ item.title }}
    </div>
  `,
  imports: [HoverClassDirective]
})
export class CardComponent {}
```

---

## Live Demo

{{ NgDocActions.demoPane("HoverClassDemoComponent") }}
