A lightweight service for managing browser cookies with SSR safety and security-aware defaults.

## Features

- **CRUD Operations** — Get, set, delete individual or all cookies
- **SSR Safe** — Returns safe defaults on server (no `document` access)
- **Security Compliant** — Auto-enforces `secure` flag when `SameSite=None`
- **Flexible Options** — Expiry, path, domain, partitioned, and more

---

## Installation

```typescript
import { CookieService, provideCookieService } from '@ngx-oneforall/services/cookie';
```

---

## Basic Usage

```typescript
import { Component, inject } from '@angular/core';
import { CookieService, provideCookieService } from '@ngx-oneforall/services/cookie';

@Component({
  selector: 'app-demo',
  template: `<button (click)="save()">Save</button>`,
  providers: [provideCookieService()],
})
export class DemoComponent {
  private cookies = inject(CookieService);

  save() {
    // Set cookie with 1 hour expiry
    this.cookies.set('user', 'JohnDoe', { expires: 3600 });
    
    // Get cookie value
    const user = this.cookies.get('user'); // 'JohnDoe'
    
    // Delete cookie
    this.cookies.delete('user');
  }
}
```

---

## API Reference

| Method | Returns | Description |
|--------|---------|-------------|
| `get(name)` | `string` | Returns cookie value or `''` if not found |
| `getAll()` | `Record<string, string>` | Returns all cookies as key-value object |
| `set(name, value, options?)` | `void` | Sets a cookie with optional config |
| `delete(name, options?)` | `void` | Deletes the specified cookie |
| `deleteAll(options?)` | `void` | Deletes all cookies |

---

## Cookie Options

```typescript
interface CookieOptions {
  sameSite?: 'Strict' | 'Lax' | 'None';  // Default: 'Lax'
  domain?: string;
  path?: string;
  secure?: boolean;
  partitioned?: boolean;
  expires?: number | Date;  // number = seconds
}
```

---

## SSR Behavior

On server-side rendering (SSR), all methods return safe defaults:

| Method | SSR Return |
|--------|------------|
| `get()` | `''` |
| `getAll()` | `{}` |
| `set()` / `delete()` / `deleteAll()` | No-op |

---

## Security Notes

> [!WARNING]
> When `SameSite=None` is set, the service automatically enables `secure: true` and logs a console warning. This is required by browser security policies.

---

## Live Demo

{{ NgDocActions.demo("CookieServiceDemoComponent") }}
