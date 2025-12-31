![Bundle Size](https://deno.bundlejs.com/badge?q=ngx-oneforall/directives/shortcut&treeshake=[*]&config={"esbuild":{"external":["rxjs","@angular/core","@angular/common","@angular/forms","@angular/router"]}})

Binds keyboard shortcuts to trigger actions with support for modifiers and global/scoped listening.

## Features

- **Multiple Shortcuts** — Comma-separated patterns (e.g., `'ctrl.s, meta.s'`)
- **Modifier Support** — `ctrl`, `shift`, `alt`, `meta` (cmd)
- **Global/Scoped** — Listen on window or element-only
- **Layout Independent** — Uses physical key codes for cross-keyboard support
- **Performance Optimized** — Cached shortcut parsing with computed signals

---

## Installation

```typescript
import { ShortcutDirective } from 'ngx-oneforall/directives/shortcut';
```

---

## API Reference

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `shortcut` | `string` | **Required** | Shortcut pattern(s) |
| `isGlobal` | `boolean` | `false` | Listen globally on window |

| Output | Type | Description |
|--------|------|-------------|
| `action` | `void` | Emits when shortcut is triggered |

### Shortcut Format

```
modifier.modifier.key
```

**Modifiers:** `ctrl`, `shift`, `alt`, `meta`, `cmd`

**Examples:**
- `ctrl.s` — Ctrl+S
- `meta.s` — Cmd+S (Mac)
- `ctrl.shift.s` — Ctrl+Shift+S
- `ctrl.s, meta.s` — Ctrl+S or Cmd+S

---

## Basic Usage

```html
<!-- Element scoped (requires focus) -->
<input [shortcut]="'ctrl.s'" (action)="save()" />

<!-- Global (works anywhere) -->
<div [shortcut]="'ctrl.k'" [isGlobal]="true" (action)="openSearch()"></div>
```

---

## Common Use Cases

### Save Shortcut (Cross-Platform)

```html
<div [shortcut]="'ctrl.s, meta.s'" [isGlobal]="true" (action)="save()">
  Press Ctrl+S or Cmd+S to save
</div>
```

### Command Palette

```typescript
@Component({
  template: `
    <div [shortcut]="'ctrl.k, meta.k'" [isGlobal]="true" (action)="openPalette()">
      @if (paletteOpen()) {
        <command-palette />
      }
    </div>
  `,
  imports: [ShortcutDirective]
})
export class AppComponent {
  paletteOpen = signal(false);
  
  openPalette() {
    this.paletteOpen.set(true);
  }
}
```

---

## Live Demo

{{ NgDocActions.demoPane("ShortcutDemoComponent") }}
