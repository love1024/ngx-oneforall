Observable-based keyboard shortcut handling with cross-platform modifier support.

## Features

- **Observable API** — Returns `Observable<KeyboardEvent>` for shortcuts
- **Cross-Platform** — `cmd`/`meta` maps to `ctrl` on non-Apple platforms
- **Multiple Shortcuts** — Comma-separated: `"ctrl.s, meta.s"`
- **Scoped/Global** — Listen on specific elements or globally
- **SSR Safe** — No listeners attached on server

---

## Installation

```typescript
import { 
  ShortcutService, 
  provideShortcutService,
  ShortcutOptions 
} from '@ngx-oneforall/services/shortcut';
```

---

## Basic Usage

```typescript
import { Component, inject } from '@angular/core';
import { ShortcutService, provideShortcutService } from '@ngx-oneforall/services/shortcut';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-demo',
  template: `<p>Press Ctrl+S to save</p>`,
  providers: [provideShortcutService()],
})
export class DemoComponent {
  private shortcuts = inject(ShortcutService);

  constructor() {
    this.shortcuts.observe({ key: 'ctrl.s', isGlobal: true })
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.save());
  }

  save() {
    console.log('Saved!');
  }
}
```

---

## API Reference

### `observe(options: ShortcutOptions)`

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `key` | `string` | **required** | Shortcut pattern(s), e.g. `"ctrl.s"` |
| `isGlobal` | `boolean` | `false` | Listen on window |
| `element` | `HTMLElement` | — | Target element (if not global) |
| `preventDefault` | `boolean` | `true` | Prevent browser default |

---

## Shortcut Patterns

```typescript
// Single shortcut
{ key: 'ctrl.s' }

// Multiple shortcuts (either triggers)
{ key: 'ctrl.s, meta.s' }

// Multiple modifiers
{ key: 'ctrl.shift.n' }

// Arrow keys and special keys
{ key: 'ctrl.arrowup' }
{ key: 'escape' }
{ key: 'enter' }
```

---

## Supported Keys

### Modifiers
`ctrl`, `shift`, `alt`, `meta` (cmd), `control`

### Special Keys
`enter`, `escape` (esc), `space`, `tab`, `backspace`, `delete`

### Arrow Keys
`arrowup` (up), `arrowdown` (down), `arrowleft` (left), `arrowright` (right)

### Punctuation
`period` (.), `comma` (,), `slash` (/), `minus` (-), `equal` (=)

---

## Cross-Platform Shortcuts

```typescript
// Works on both Mac (Cmd+S) and Windows/Linux (Ctrl+S)
{ key: 'ctrl.s, meta.s' }

// On non-Apple platforms, 'cmd' auto-maps to 'ctrl'
{ key: 'cmd.s' } // → ctrl.s on Windows
```

---

## Element-Scoped Shortcuts

```typescript
@ViewChild('editor') editor!: ElementRef;

ngAfterViewInit() {
  this.shortcuts.observe({
    key: 'ctrl.enter',
    element: this.editor.nativeElement,
    isGlobal: false,
  }).subscribe(() => this.submit());
}
```

---

## Live Demo

{{ NgDocActions.demo("ShortcutServiceDemoComponent") }}
