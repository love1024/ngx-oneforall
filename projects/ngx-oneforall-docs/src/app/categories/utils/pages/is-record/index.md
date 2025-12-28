`isRecord` is a type guard that checks if a value is a plain object (record) as opposed to built-in types like Date, Map, Array, or class instances.

## Usage

Use `isRecord` when you need to distinguish plain objects from other object types for type-safe operations like iteration, cloning, or serialization.

### Basic Example

```typescript
import { isRecord } from '@ngx-oneforall/utils/is-record';

const plainObject = { name: 'John', age: 30 };
const date = new Date();
const map = new Map();

console.log(isRecord(plainObject)); // true
console.log(isRecord(date));        // false
console.log(isRecord(map));         // false
console.log(isRecord([]));          // false
```

### Type Guard

```typescript
function processData(value: unknown) {
    if (isRecord(value)) {
        // TypeScript knows value is Record<string, unknown>
        Object.keys(value).forEach(key => {
            console.log(key, value[key]);
        });
    }
}
```

### Null-Prototype Objects

```typescript
const nullProto = Object.create(null);
nullProto.foo = 'bar';

console.log(isRecord(nullProto)); // true - handles dictionary pattern
```

## API

`isRecord(value: unknown): value is Record<string, unknown>`

- **value**: The value to check.

Returns `true` if the value is a plain object, `false` otherwise.

### What is Considered a Record?

✅ **Accepted:**
- Plain objects: `{}`
- Object literals: `{ a: 1, b: 2 }`
- `new Object()`
- `Object.create(null)` (null-prototype objects)

❌ **Rejected:**
- Arrays: `[]`
- Built-in types: `Date`, `Map`, `Set`, `RegExp`, `Error`, `Promise`
- Weak collections: `WeakMap`, `WeakSet`
- Class instances: `new MyClass()`
- Primitives: `string`, `number`, `boolean`, `null`, `undefined`

## Implementation

Uses `Object.prototype.toString.call()` for reliable type checking:

```typescript
export const isRecord = (value: unknown): value is Record<string, unknown> => {
  return Object.prototype.toString.call(value) === '[object Object]';
};
```

> **Note**
> This check is fast and reliable. However, it accepts class instances. If you need stricter checking excluding class instances, consider additional prototype chain validation.

## When to Use

✅ **Good use cases:**
- Safe object iteration
- Type-safe serialization
- Validating API responses
- Type guards for unknowns

❌ **Avoid when:**
- You need to accept arrays
- You want to include class instances
- Performance is extremely critical (though this is very fast)
