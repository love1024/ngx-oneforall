![Bundle Size](https://deno.bundlejs.com/badge?q=ngx-oneforall/services/clipboard&treeshake=[*]&config={"esbuild":{"external":["rxjs","@angular/core","@angular/common","@angular/forms","@angular/router"]}})

A simple service for copying and reading text from the system clipboard with automatic fallback for older browsers.

## Features

- **Modern Clipboard API** — Uses `navigator.clipboard` when available
- **Automatic Fallback** — Falls back to `execCommand('copy')` for older browsers
- **SSR Safe** — Returns safe defaults on server
- **Promise-based** — Async/await friendly API

---

## Installation

```typescript
import { ClipboardService } from 'ngx-oneforall/services/clipboard';
```

---

## Basic Usage

```typescript
import { Component, inject } from '@angular/core';
import { ClipboardService } from 'ngx-oneforall/services/clipboard';

@Component({
  selector: 'app-demo',
  template: `
    <button (click)="copyText()">Copy</button>
    <button (click)="pasteText()">Paste</button>
  `,
  providers: [ClipboardService],
})
export class DemoComponent {
  private clipboard = inject(ClipboardService);

  async copyText() {
    const success = await this.clipboard.copy('Hello World');
    console.log(success ? 'Copied!' : 'Failed to copy');
  }

  async pasteText() {
    const text = await this.clipboard.read();
    console.log('Clipboard:', text);
  }
}
```

---

## API Reference

| Method | Returns | Description |
|--------|---------|-------------|
| `copy(text)` | `Promise<boolean>` | Copies text to clipboard, returns `true` on success |
| `read()` | `Promise<string>` | Reads text from clipboard, returns `''` on failure |

---

## SSR Behavior

On server-side rendering (SSR):

| Method | SSR Return |
|--------|------------|
| `copy()` | `false` |
| `read()` | `''` |

---

## Browser Compatibility

> [!NOTE]
> The Clipboard API requires user interaction and HTTPS. On HTTP or without user gesture, the fallback mechanism will be used for `copy()`.

---

## Live Demo

{{ NgDocActions.demo("ClipboardDemoComponent") }}
