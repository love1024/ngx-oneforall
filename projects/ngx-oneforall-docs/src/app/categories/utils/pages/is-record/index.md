Type guard that checks if a value is a plain object (record) as opposed to built-in types, arrays, or class instances.

## Usage

```typescript
import { isRecord } from 'ngx-oneforall/utils/is-record';
```

## API

`isRecord(value: unknown): value is Record<string, unknown>`

Returns `true` if value is a plain object, `false` otherwise.

## Quick Examples

```typescript
isRecord({});              // true
isRecord({ a: 1, b: 2 });  // true
isRecord(Object.create(null)); // true (null-prototype)

isRecord([1, 2, 3]);       // false (array)
isRecord(new Date());      // false (built-in)
isRecord(new Map());       // false (built-in)
isRecord(new MyClass());   // false (class instance)
isRecord(null);            // false
```

## Truth Table

| Input | Result | Reason |
|-------|--------|--------|
| `{}` | ✅ | Plain object literal |
| `{ a: 1 }` | ✅ | Plain object with properties |
| `Object.create(null)` | ✅ | Null-prototype object |
| `[]` | ❌ | Array |
| `new Date()` | ❌ | Built-in |
| `new Map()` | ❌ | Built-in |
| `new Set()` | ❌ | Built-in |
| `new Error()` | ❌ | Built-in |
| `new MyClass()` | ❌ | Class instance |
| `null` | ❌ | Not an object |
| `undefined` | ❌ | Not an object |

## Detection Strategy

The implementation uses a multi-step approach for accuracy and performance:

1. **Fast path**: Check if prototype is `null` or `Object.prototype`
2. **Built-in exclusion**: Check against known non-record constructors (Date, Map, Set, etc.)
3. **Fallback**: Use `Object.prototype.toString` for edge cases

> **Note**
> This implementation explicitly excludes class instances and all JavaScript built-in types including `ArrayBuffer`, `Blob`, `File`, `URL`, and more.

## Example: Type-Safe Iteration

```typescript
function processData(value: unknown) {
  if (isRecord(value)) {
    // TypeScript knows value is Record<string, unknown>
    Object.entries(value).forEach(([key, val]) => {
      console.log(key, val);
    });
  }
}
```

## Example: Deep Clone Safety

```typescript
function safeClone(obj: unknown): unknown {
  if (!isRecord(obj)) {
    return obj; // Return primitives/built-ins as-is
  }
  
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    result[key] = safeClone(value);
  }
  return result;
}
```

## Use Cases

- **Safe object iteration**: Avoid iterating arrays or class instances
- **Serialization**: Validate objects before JSON.stringify
- **API validation**: Check if response is a plain object
- **State management**: Distinguish records from other object types

