![Bundle Size](https://deno.bundlejs.com/badge?q=ngx-oneforall/signals/deep-computed&treeshake=[*]&config={"esbuild":{"external":["rxjs","@angular/core","@angular/common","@angular/forms","@angular/router"]}})

`deepComputed` creates a computed signal that allows readonly nested property access using proxy syntax. This is useful for accessing deeply nested properties as signals, rather than repeatedly calling the root signal.

> **Note**
> If you need writable nested properties, use `stateSignal` instead.

## Usage

Use `deepComputed` when you have complex nested objects in signals and want individual property access.

{{ NgDocActions.demo("DeepComputedDemoComponent", { container: true }) }}



### Basic Example

```typescript
import { signal, computed } from '@angular/core';
import { deepComputed } from 'ngx-oneforall/signals/deep-computed';

@Component({ ... })
export class MyComponent {
    user = signal({ profile: { name: 'John', age: 30 } });
    userComputed = deepComputed(() => this.user());

    // Access nested properties as signals
    name = this.userComputed.profile.name; // Signal<string>
    
    ngOnInit() {
        console.log(this.name()); // 'John'
    }
}
```



### Reactive Updates

```typescript
user = signal({ profile: { name: 'John' } });
deep = deepComputed(() => this.user());

console.log(deep.profile.name()); // 'John'

user.set({ profile: { name: 'Jane' } });
console.log(deep.profile.name()); // 'Jane' - automatically reactive
```

## API

`deepComputed<T>(factory: () => T): DeepComputed<T>`

- **factory**: A computation function that returns an object.

Returns a proxy-wrapped computed signal that provides nested signal access.

### How It Works

- **Signal Access**: Each nested property returns a computed signal
- **Proxy Recursion**: Nested objects are recursively wrapped in `deepComputed`
- **Caching**: Signals and proxies are cached for performance
- **Type Safety**: Full TypeScript support with proper type inference

> **Note**
> `deepComputed` only works with plain objects. Arrays and built-in types (Date, Map, etc.) are returned as regular signals.

## When to Use

✅ **Good use cases:**
- Complex nested state from stores
- Deeply nested API responses
- Avoiding repetitive signal calls

❌ **Avoid when:**
- State is flat or simple
- Performance is critical (adds proxy overhead)
- Working with arrays or collections
