![Bundle Size](https://deno.bundlejs.com/badge?q=ngx-oneforall/directives/click-outside&treeshake=[*]&config={"esbuild":{"external":["rxjs","@angular/core","@angular/common","@angular/forms","@angular/router"]}})

Detects clicks outside an element, useful for closing dropdowns, modals, and popovers.

## Features

- **Capture Phase** — Detects clicks even when `stopPropagation()` is called
- **Zone Optimized** — Runs outside Angular zone for better performance
- **Toggleable** — Enable/disable via `clickOutsideEnabled` input
- **SSR Safe** — Only activates in the browser

---

## Installation

```typescript
import { ClickOutsideDirective } from 'ngx-oneforall/directives/click-outside';
```

---

## Basic Usage

```html
<div (clickOutside)="onClickedOutside($event)">
  <!-- Dropdown content -->
</div>
```

```typescript
onClickedOutside(event: Event) {
  this.isOpen = false;
}
```

---

## API Reference

| Input/Output | Type | Default | Description |
|--------------|------|---------|-------------|
| `clickOutside` | `OutputEmitterRef<Event>` | — | Emits when a click occurs outside the element |
| `clickOutsideEnabled` | `boolean` | `true` | Enables/disables click detection |

---

## Disabling Detection

Temporarily disable outside click detection:

```html
<div 
  (clickOutside)="close()" 
  [clickOutsideEnabled]="isDropdownOpen">
  <!-- Only detects outside clicks when dropdown is open -->
</div>
```

---

## Common Use Cases

### Dropdown Menu

```typescript
@Component({
  template: `
    <div class="dropdown" (clickOutside)="close()" [clickOutsideEnabled]="isOpen">
      <button (click)="toggle()">Menu</button>
      @if (isOpen) {
        <ul class="menu">...</ul>
      }
    </div>
  `,
  imports: [ClickOutsideDirective]
})
export class DropdownComponent {
  isOpen = false;
  toggle() { this.isOpen = !this.isOpen; }
  close() { this.isOpen = false; }
}
```

---

## Live Demo

{{ NgDocActions.demoPane("ClickOutsideDemoComponent") }}
