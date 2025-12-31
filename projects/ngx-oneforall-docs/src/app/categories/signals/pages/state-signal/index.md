![Bundle Size](https://deno.bundlejs.com/badge?q=ngx-oneforall/signals/state-signal&treeshake=[*]&config={"esbuild":{"external":["rxjs","@angular/core","@angular/common","@angular/forms","@angular/router"]}})

`stateSignal` creates a deep writable signal that allows nested property access and updates using proxy syntax. Updates to nested properties automatically propagate (bubble) up to the root signal.

## Usage

Use `stateSignal` when you have complex nested objects and want ergonomic property access with the ability to update nested values directly.

{{ NgDocActions.demo("StateSignalDemoComponent", { container: true }) }}

### Basic Example

```typescript
import { stateSignal } from 'ngx-oneforall/signals/state-signal';

@Component({ ... })
export class MyComponent {
    state = stateSignal({ 
        user: { 
            name: 'John', 
            age: 30 
        } 
    });

    // Access nested properties as signals
    name = this.state.user.name; // StateSignal<string>
    
    ngOnInit() {
        console.log(this.name()); // 'John'
        
        // Update nested property - automatically bubbles to root
        this.name.set('Jane');
        console.log(this.state().user.name); // 'Jane'
    }
}
```

### Nested Updates with Bubbling

```typescript
state = stateSignal({ 
    profile: { 
        address: { 
            city: 'New York' 
        } 
    } 
});

// Direct nested update
state.profile.address.city.set('Los Angeles');

// Root signal is updated automatically
console.log(state().profile.address.city); // 'Los Angeles'

// Use update() for derived values
state.profile.address.city.update(city => city.toUpperCase());
```

### Using with Existing Signal

```typescript
import { signal } from '@angular/core';
import { stateSignal } from 'ngx-oneforall/signals/state-signal';

// Wrap an existing signal
const source = signal({ count: 0 });
const state = stateSignal(source);

state.count.set(10);
console.log(source().count); // 10 - source is updated
```

## API

`stateSignal<T>(initialValue: T | WritableSignal<T>, onUpdate?: (value: T) => void): StateSignal<T>`

- **initialValue**: An object or an existing `WritableSignal` to wrap
- **onUpdate**: Optional callback invoked when the signal is updated (used internally for bubbling)

Returns a proxy-wrapped writable signal that provides nested signal access with update propagation.

### Available Methods

- `set(value)` - Replace the value at any level
- `update(fn)` - Update based on current value
- `asReadonly()` - Get a readonly version of the signal
- `()` - Read the current value

### How It Works

- **Nested Signals**: Each nested property returns a writable `StateSignal`
- **Bubbling**: Updates at any level propagate to the root with new object references
- **Caching**: Nested signals are cached for performance
- **Type Safety**: Full TypeScript support with proper type inference

> **Note**
> `stateSignal` only recurses into plain objects. Arrays are treated as single signals and not recursed into element-by-element.

## When to Use

✅ **Good use cases:**
- Complex nested form state
- Deeply nested configuration objects
- When you need to update specific nested properties without manually spreading

❌ **Avoid when:**
- State is flat or simple
- Working primarily with arrays (use regular signals)
- Performance is critical (adds proxy overhead)

## Comparison with deepComputed

| Feature | `stateSignal` | `deepComputed` |
|---------|---------------|----------------|
| **Writable** | ✅ Yes | ❌ Read-only |
| **Bubbling** | ✅ Updates propagate to root | N/A |
| **Use case** | Mutable nested state | Derived nested state |
