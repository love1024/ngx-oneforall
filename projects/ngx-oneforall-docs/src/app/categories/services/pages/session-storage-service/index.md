Type-safe wrapper around browser sessionStorage with transformers for different data types.

## Features

- **Type-Safe** — Use transformers for JSON, Number, Boolean, Date, Base64
- **Key Prefix** — Optional prefix for all keys  
- **SSR Safe** — Falls back to in-memory storage on server
- **New Methods** — `keys()` and `getAll()` for bulk operations
- **Session Scoped** — Data cleared when browser tab closes

---

## Installation

```typescript
import { 
  SessionStorageService, 
  provideSessionStorage, 
  StorageTransformers 
} from '@ngx-oneforall/services/storage';
```

---

## Basic Usage

```typescript
import { Component, inject } from '@angular/core';
import { SessionStorageService, provideSessionStorage } from '@ngx-oneforall/services/storage';

@Component({
  selector: 'app-demo',
  template: `<p>Token: {{ token }}</p>`,
  providers: [provideSessionStorage()],
})
export class DemoComponent {
  private storage = inject(SessionStorageService);
  token = this.storage.get('auth_token') ?? '';

  saveToken(value: string) {
    this.storage.set('auth_token', value);
  }
}
```

---

## API Reference

| Method | Returns | Description |
|--------|---------|-------------|
| `get<T>(key, transformer?)` | `T \| undefined` | Get value by key |
| `set<T>(key, value, transformer?)` | `void` | Set value by key |
| `has(key)` | `boolean` | Check if key exists |
| `remove(key)` | `void` | Remove key |
| `clear()` | `void` | Clear all keys (prefix-aware) |
| `keys()` | `string[]` | Get all keys |
| `getAll<T>(transformer?)` | `Map<string, T>` | Get all key-value pairs |
| `length()` | `number` | Number of stored items |

---

## Transformers

```typescript
import { StorageTransformers } from '@ngx-oneforall/services/storage';

// Store as JSON
storage.set('session', { id: '123' }, StorageTransformers.JSON);
const session = storage.get('session', StorageTransformers.JSON);

// Store as Boolean
storage.set('isLoggedIn', true, StorageTransformers.BOOLEAN);
const isLoggedIn = storage.get('isLoggedIn', StorageTransformers.BOOLEAN);
```

| Transformer | Type | Description |
|-------------|------|-------------|
| `STRING` | `string` | Default, no transformation |
| `JSON` | `object` | JSON.stringify/parse |
| `NUMBER` | `number` | Number conversion |
| `BOOLEAN` | `boolean` | Boolean conversion |
| `DATE` | `Date` | ISO date string |
| `BASE64` | `Uint8Array` | Binary data |

---

## Key Prefix

```typescript
// All keys prefixed with 'session_'
providers: [provideSessionStorage('session_')]
```

---

## SSR Behavior

On server-side rendering, `SessionStorageService` automatically uses in-memory storage (no errors).

---

## Local vs Session Storage

| Feature | LocalStorage | SessionStorage |
|---------|--------------|----------------|
| Persistence | Until cleared | Until tab closes |
| Shared | All tabs | Single tab only |
| Use case | User preferences | Auth tokens, temp data |

---

## Live Demo

{{ NgDocActions.demo("SessionStorageServiceDemoComponent") }}
