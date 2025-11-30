The **ShortcutService** provides an Observable-based API for handling keyboard shortcuts. It allows you to listen for shortcuts globally or on specific elements, with support for modifiers and strict matching.

## Features

- **Observable API:** Returns an Observable that emits when the shortcut is triggered.
- **Global & Scoped:** Listen globally (window) or on specific elements.
- **Strict Matching:** Ensures no extra keys are pressed.
- **Prevent Default:** Automatically prevents default browser actions (configurable).
- **Expanded Modifiers:** Supports standard and non-standard modifiers (e.g., `space`, `enter`, `up`, `down`).

## Usage

Inject the `ShortcutService` and use the `observe` method to start listening for shortcuts.

```typescript
import { Component, inject } from '@angular/core';
import { ShortcutService } from 'ngx-oneforall';

@Component({ ... })
export class MyComponent {
  private shortcutService = inject(ShortcutService);

  constructor() {
    // Listen globally for Ctrl + S
    this.shortcutService.observe({ 
      key: 'ctrl.s', 
      isGlobal: true 
    }).subscribe(() => {
      console.log('Save triggered!');
    });
  }
}
```

## Configuration

The `observe` method accepts a `ShortcutOptions` object:

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `key` | `string` | **Required** | The shortcut key combination(s). Format: `modifier.key` (e.g., `ctrl.s`, `shift.enter`). Supports comma-separated multiple shortcuts. |
| `isGlobal` | `boolean` | `false` | If `true`, listens globally on the window. |
| `element` | `HTMLElement` | `undefined` | The element to listen on if `isGlobal` is `false`. Defaults to window if not provided but `isGlobal` is false. |
| `preventDefault` | `boolean` | `true` | If `true`, calls `event.preventDefault()` when the shortcut matches. |

## Supported Modifiers

`shift`, `control` (ctrl), `alt`, `meta` (cmd), `altleft`, `backspace`, `tab`, `left`, `right`, `up`, `down`, `enter`, `space`, `escape` (esc).

## Demo

{{ NgDocActions.demo("ShortcutServiceDemoComponent") }}
