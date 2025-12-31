![Bundle Size](https://deno.bundlejs.com/badge?q=ngx-oneforall/directives/auto-focus&treeshake=[*]&config={"esbuild":{"external":["rxjs","@angular/core","@angular/common","@angular/forms","@angular/router"]}})

Automatically focuses an element when rendered, with reactive two-way binding support.

## Features

- **Auto Focus** — Focuses the element immediately on render
- **Two-Way Binding** — Sync focus state with parent via `[(isFocused)]`
- **SSR Safe** — Only runs in the browser via `afterNextRender`

---

## Installation

```typescript
import { AutoFocusDirective } from 'ngx-oneforall/directives/auto-focus';
```

---

## Basic Usage

```html
<!-- Auto focus on render -->
<input autoFocus />

<!-- With two-way binding -->
<input autoFocus [(isFocused)]="focusState" />

<!-- Read-only binding -->
<input autoFocus [isFocused]="shouldFocus" />
```

---

## API Reference

| Input/Output | Type | Default | Description |
|--------------|------|---------|-------------|
| `isFocused` | `ModelSignal<boolean>` | `true` | Two-way bindable focus state |

### Host Events

| Event | Behavior |
|-------|----------|
| `focus` | Sets `isFocused` to `true` |
| `blur` | Sets `isFocused` to `false` |

---

## Programmatic Control

Use two-way binding to control focus from your component:

```typescript
@Component({
  template: `
    <input autoFocus [(isFocused)]="isFocused" />
    <button (click)="focusInput()">Focus Input</button>
  `,
  imports: [AutoFocusDirective]
})
export class MyComponent {
  isFocused = signal(false);

  focusInput() {
    this.isFocused.set(true);
  }
}
```

---

## Live Demo

{{ NgDocActions.demoPane("AutoFocusDemoComponent") }}
