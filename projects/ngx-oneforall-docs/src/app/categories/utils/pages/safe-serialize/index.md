Safely serializes any JavaScript value to a JSON string, including non-JSON types like functions, symbols, BigInt, and circular references. Produces deterministic output for caching and memoization.

## Usage

```typescript
import { safeSerialize } from '@ngx-oneforall/utils/safe-serialize';

const key = safeSerialize({ name: 'John', count: BigInt(42) });
// '{"count":"__bigint:42","name":"John"}'
```

## Serialization Format

| Type | Serialized Format |
|------|-------------------|
| Function (named) | `"__fn:functionName"` |
| Function (anonymous) | `"__fn:anonymous\|h:hash"` |
| Symbol | `"__sym:Symbol(description)"` |
| BigInt | `"__bigint:123"` |
| Date | ISO string (built-in JSON behavior) |
| RegExp | `{ __type: 'RegExp', value: '/pattern/flags' }` |
| Error | `{ __type: 'Error', name, message }` |
| Map | `{ __type: 'Map', entries: [[k, v], ...] }` |
| Set | `{ __type: 'Set', values: [...] }` |
| WeakMap | `{ __type: 'WeakMap', note: 'Not iterable' }` |
| WeakSet | `{ __type: 'WeakSet', note: 'Not iterable' }` |
| Class instance | `{ __type: 'ClassName', ...props }` |
| Circular ref | `"__circular__"` |

> **Note**
> Object keys are sorted alphabetically for deterministic output. `{ b: 2, a: 1 }` serializes the same as `{ a: 1, b: 2 }`.

## Quick Examples

```typescript
// Functions
safeSerialize(() => {}); // '"__fn:anonymous|h:-1234567"'

// Symbols and BigInt
safeSerialize([Symbol('id'), BigInt(999)]);
// '["__sym:Symbol(id)","__bigint:999"]'

// Circular references
const obj = { name: 'root' };
obj.self = obj;
safeSerialize(obj); // '{"name":"root","self":"__circular__"}'

// Map and Set
safeSerialize(new Map([['a', 1]]));
// '{"__type":"Map","entries":[["a",1]]}'
```

## Use Cases

- **Memoization keys**: Generate cache keys from any arguments
- **Argument hashing**: Create stable fingerprints for function calls
- **Deep comparison**: Compare complex objects by their serialized form
- **Logging**: Serialize non-JSON values for debugging

## Demo

{{ NgDocActions.demo("SafeSerializeDemoComponent") }}

## Limitations

- **Not reversible**: Cannot deserialize back to original values
- **Lossy for functions/symbols**: Only names/descriptions are preserved
- **WeakMap/WeakSet**: Cannot iterate, serialized with placeholder
- **Same-name collision**: Different functions with same name produce same output

