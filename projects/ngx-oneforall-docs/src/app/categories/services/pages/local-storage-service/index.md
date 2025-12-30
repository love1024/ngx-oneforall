Type-safe wrapper around browser localStorage with transformers for different data types.

## Features

- **Type-Safe** — Use transformers for JSON, Number, Boolean, Date, Base64
- **Key Prefix** — Optional prefix for all keys  
- **SSR Safe** — Falls back to in-memory storage on server
- **New Methods** — `keys()` and `getAll()` for bulk operations

---

## Installation

```typescript
import { 
  LocalStorageService, 
  provideLocalStorage, 
  StorageTransformers 
} from 'ngx-oneforall/services/storage';
```

---

## Basic Usage

```typescript
import { Component, inject } from '@angular/core';
import { LocalStorageService, provideLocalStorage } from 'ngx-oneforall/services/storage';

@Component({
  selector: 'app-demo',
  template: `<p>Name: {{ name }}</p>`,
  providers: [provideLocalStorage()],
})
export class DemoComponent {
  private storage = inject(LocalStorageService);
  name = this.storage.get('user_name') ?? 'Guest';

  saveName(value: string) {
    this.storage.set('user_name', value);
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
import { StorageTransformers } from 'ngx-oneforall/services/storage';

// Store as JSON
storage.set('user', { name: 'John' }, StorageTransformers.JSON);
const user = storage.get('user', StorageTransformers.JSON);

// Store as Number
storage.set('count', 42, StorageTransformers.NUMBER);
const count = storage.get('count', StorageTransformers.NUMBER);
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
// All keys prefixed with 'app_'
providers: [provideLocalStorage('app_')]
```

---

## SSR Behavior

On server-side rendering, `LocalStorageService` automatically uses in-memory storage (no errors).

---

## Live Demo

{{ NgDocActions.demo("LocalStorageServiceDemoComponent") }}
