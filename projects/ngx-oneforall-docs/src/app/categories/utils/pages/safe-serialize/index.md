`safeSerialize` is a utility for serializing an array of values or function arguments—including types that are not supported by JSON.stringify, such as functions, symbols, bigint, and circular references. It is designed to produce a stable string representation for any combination of JavaScript values, making it ideal for use cases like memoization, caching, or argument hashing.

---

## Usage

```ts
import { safeSerialize } from '@ngx-oneforall/utils';

const args = [1, 'foo', Symbol('bar'), () => 42, { a: 1 }, BigInt(123)];
const key = safeSerialize(args);
```

---

## Features
- Handles all JavaScript value types, including functions, symbols, bigint, and circular references
- Produces a stable, deterministic string for any array of arguments
- Useful for memoization, cache keys, or argument hashing

---

## Demo
See the interactive demo below for example inputs and their serialized outputs.

{{ NgDocActions.demo("SafeSerializeDemoComponent") }}

---

## Drawbacks & Limitations

- Not reversible: The output of `safeSerialize` cannot be reliably deserialized back to the original values, especially for functions, symbols, bigints, and circular references.
- Not a full object diff: It is designed for stable stringification, not for deep equality or diffing complex objects.
- Function and symbol representation is lossy: Functions are represented as `__fn:name` and symbols as `__sym:desc`, so their actual implementation or identity is lost.
- No support for non-enumerable properties, prototype chains, or class instances: Only enumerable own properties are serialized, and class-specific information is not preserved.
- May not distinguish between some edge cases: Different functions with the same name, or different symbols with the same description, will serialize to the same string.
