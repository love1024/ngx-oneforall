`storageSignal` creates a reactive signal that automatically syncs with browser storage (`localStorage` or `sessionStorage`). Changes to the signal persist to storage, and the signal can optionally sync across browser tabs.

## Usage

Use `storageSignal` to persist state across page refreshes or share state between tabs.

{{ NgDocActions.demo("StorageSignalDemoComponent", { container: true }) }}

### Basic Example

```typescript
import { storageSignal } from '@ngx-oneforall/signals/storage-signal';

@Component({ ... })
export class MyComponent {
    // Persists to localStorage under key 'counter'
    counter = storageSignal<number>('counter', 0);

    increment() {
        this.counter.update(c => c + 1);
        // Value is automatically saved to localStorage
    }
}
```

> **Note**
> The signal must be created within an injection context (e.g., constructor, field initializer) or you must provide an `injector` in options.

### Using Session Storage

```typescript
// Use sessionStorage instead of localStorage
const token = storageSignal<string>('session-token', '', { 
    storage: sessionStorage 
});
```

### Cross-Tab Synchronization

```typescript
// Changes in one tab will reflect in all open tabs
const cart = storageSignal<string[]>('cart', [], { 
    crossTabSync: true 
});
```

### Custom Serialization

```typescript
interface User {
    id: number;
    name: string;
}

const user = storageSignal<User>('current-user', { id: 0, name: '' }, {
    serializer: (value) => JSON.stringify(value),
    deserializer: (data) => JSON.parse(data)
});
```

## API

`storageSignal<T>(key: string, defaultValue: T, options?: StorageSignalOptions<T>): WritableSignal<T>`

### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `key` | `string` | The storage key to use |
| `defaultValue` | `T` | Initial value if nothing in storage |
| `options` | `StorageSignalOptions<T>` | Optional configuration |

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `storage` | `Storage` | `localStorage` | Storage backend (`localStorage`, `sessionStorage`, or custom) |
| `serializer` | `(v: T) => string` | `JSON.stringify` | Function to serialize value to string |
| `deserializer` | `(data: string) => T` | `JSON.parse` | Function to deserialize string to value |
| `crossTabSync` | `boolean` | `false` | Sync changes across browser tabs |
| `injector` | `Injector` | Current injector | Angular injector for use outside injection context |

## When to Use

✅ **Good use cases:**
- User preferences (theme, language)
- Form draft auto-save
- Shopping cart persistence
- Authentication tokens

❌ **Avoid when:**
- Storing sensitive data (use secure cookies instead)
- Large datasets (storage limits apply)
- Data that changes very frequently (storage writes are synchronous)
