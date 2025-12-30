Comprehensive type detection utility that returns a `Types` enum value for any JavaScript value. Supports all primitives, collections, typed arrays, and iterators.

## Usage

```typescript
import { findType } from 'ngx-oneforall/utils/find-type';
import { Types } from 'ngx-oneforall/constants';

findType(42);           // Types.Number
findType('hello');      // Types.String
findType(BigInt(123));  // Types.BigInt
findType(new Map());    // Types.Map
```

## Supported Types

| Category | Types |
|----------|-------|
| **Primitives** | `Null`, `Undefined`, `Boolean`, `String`, `Number`, `BigInt`, `Symbol` |
| **Functions** | `Function`, `GeneratorFunction` |
| **Collections** | `Array`, `Map`, `WeakMap`, `Set`, `WeakSet` |
| **Typed Arrays** | `Int8Array`, `Uint8Array`, `Uint8ClampedArray`, `Int16Array`, `Uint16Array`, `Int32Array`, `Uint32Array`, `Float32Array`, `Float64Array` |
| **Iterators** | `MapIterator`, `SetIterator`, `StringIterator`, `ArrayIterator`, `GeneratorObject` |
| **Fallback** | `Object` (for plain objects and class instances) |

## Quick Examples

```typescript
findType(null);             // Types.Null
findType(undefined);        // Types.Undefined
findType(true);             // Types.Boolean
findType(42);               // Types.Number
findType(BigInt(999));      // Types.BigInt
findType(Symbol('id'));     // Types.Symbol
findType(() => {});         // Types.Function
findType(function* () {});  // Types.GeneratorFunction
findType([1, 2, 3]);        // Types.Array
findType(new Map());        // Types.Map
findType(new Set());        // Types.Set
findType(new Int8Array());  // Types.Int8Array
findType({});               // Types.Object
```

## Type Guard Helpers

All type checking functions are also exported as type guards:

```typescript
import { isString, isNumber, isBigInt, isArray, isMap } from 'ngx-oneforall/utils/find-type';

const value: unknown = getData();

if (isString(value)) {
  console.log(value.toUpperCase()); // TypeScript knows it's string
}

if (isArray(value)) {
  console.log(value.length); // TypeScript knows it's unknown[]
}
```

## Available Type Guards

| Function | Type Guard |
|----------|------------|
| `isNull(v)` | `v is null` |
| `isUndefined(v)` | `v is undefined` |
| `isBoolean(v)` | `v is boolean` |
| `isString(v)` | `v is string` |
| `isNumber(v)` | `v is number` |
| `isBigInt(v)` | `v is bigint` |
| `isSymbol(v)` | `v is symbol` |
| `isFunction(v)` | `v is (...args) => any` |
| `isArray(v)` | `v is unknown[]` |
| `isMap(v)` | `v is Map<unknown, unknown>` |
| `isSet(v)` | `v is Set<unknown>` |
| `isDate(v)` | `v is Date` |
| `isRegexp(v)` | `v is RegExp` |
| `isError(v)` | `v is Error` |

> **Note**
> Detection order is optimized for common types first. More specific types (like `GeneratorFunction`) are checked before general ones (like `Function`).

## Use Cases

- **API validation**: Check data types from external sources
- **Dynamic rendering**: Render different UI based on value type
- **Form handling**: Validate input values before processing
- **Debugging**: Log precise runtime types
