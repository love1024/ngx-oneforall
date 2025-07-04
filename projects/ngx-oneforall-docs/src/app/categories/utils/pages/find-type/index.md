### Comprehensive Type Detection with `findType` Utility

Accurately identifying the type of a value is fundamental in TypeScript and Angular applications, especially when handling dynamic or external data. The `findType` utility provides a robust and extensible solution for type detection, supporting a wide range of JavaScript and TypeScript types, including primitives, objects, iterators, and typed arrays.


## What is `findType`?
The `findType` function examines any value and returns its type as a member of the `Types` enum. The `Types` enum can be imported from your project's constants and provides a comprehensive set of type identifiers. `findType` uses a sequence of dedicated type guard helpers to identify the most accurate type, supporting both common and advanced JavaScript objects.

```typescript
import { findType }  from "@ngxoneforall/utils";
import { Types } from "@ngxoneforall/constants";

const type: Types = findType(1);
console.log(type);
```


### Supported Types

- **Primitive Types**: `Null`, `Undefined`, `Boolean`, `String`, `Number`, `Symbol`
- **Functions**: `Function`, `GeneratorFunction`
- **Collections**: `Array`, `Map`, `WeakMap`, `Set`, `WeakSet`
- **Typed Arrays**: `Int8Array`, `Uint8Array`, `Uint8ClampedArray`, `Int16Array`, `Uint16Array`, `Int32Array`, `Uint32Array`, `Float32Array`, `Float64Array`
- **Iterators**: `MapIterator`, `SetIterator`, `StringIterator`, `ArrayIterator`, `GeneratorObject`
- **Fallback**: `Object` (for all other cases)


## How Does `findType` Work?

The function sequentially applies a set of type guard checks, each tailored to a specific type. As soon as a match is found, the corresponding `Types` enum value is returned. If no specific type is matched, it defaults to `Types.Object`.



## Example Usage

```typescript
const values = [null, 42, 'hello', new Map(), new Int8Array(), function* () {}];

values.forEach(value => {
    const type = findType(value);
    console.log(`Type of value:`, type);
});
```

**Output:**
```
Type of value: Null
Type of value: Number
Type of value: String
Type of value: Map
Type of value: Int8Array
Type of value: GeneratorFunction
```

## Helper Functions

Each helper function, such as `isArray`, `isMap`, or `isInt8Array`, encapsulates the logic for detecting its respective type, using techniques like constructor name inspection or `Object.prototype.toString` tag comparison.

### Example Helper Functions

Below are some example implementations of helper functions used by `findType`:
```typescript
// Usage examples of helper functions:

isNull(null); // true
isUndefined(undefined); // true
isArray([1, 2, 3]); // true
isMap(new Map()); // true
isInt8Array(new Int8Array()); // true
isGeneratorFunction(function* () {}); // true
```

These helpers can be extended or customized to support additional types as needed.

## Practical Applications

- **Form Validation**: Ensure input values are of expected types before processing.
- **API Data Handling**: Safely parse and validate data from external sources.
- **Utility Libraries**: Build robust, reusable functions that adapt to various data types.
- **Debugging**: Quickly inspect and log the precise type of runtime values.

---

## Best Practices

1. **Use Type Guards**: The utility relies on well-defined type guards for accuracy and type safety.
2. **Extend as Needed**: Add new type checks to support custom or emerging JavaScript types.
3. **Prefer Specificity**: The order of checks matters—more specific types should be checked before general ones.
4. **Validate External Data**: Always use type detection when working with untrusted or dynamic data.

