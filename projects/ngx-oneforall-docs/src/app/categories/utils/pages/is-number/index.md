![Bundle Size](https://deno.bundlejs.com/badge?q=ngx-oneforall/utils/is-number&treeshake=[*]&config={"esbuild":{"external":["rxjs","@angular/core","@angular/common","@angular/forms","@angular/router"]}})

Type guard utilities for validating numeric values. Provides robust checking for number primitives, numeric strings, and Number objects.

## Usage

```typescript
import { isNumberValue, isNumberString, isNumeric, isNumberObject } from 'ngx-oneforall/utils/is-number';
```

## API

| Function | Returns `true` for | Returns `false` for |
|----------|-------------------|---------------------|
| `isNumberValue(value)` | Finite number primitives | `NaN`, `Infinity`, strings, objects |
| `isNumberString(value)` | Strings parseable as numbers | Empty strings, whitespace, non-numeric |
| `isNumberObject(value)` | `new Number()` objects | Primitives, other objects |
| `isNumeric(value)` | Numbers OR numeric strings | Everything else |

## Quick Examples

```typescript
// isNumberValue - finite number primitives only
isNumberValue(42);        // true
isNumberValue(3.14);      // true
isNumberValue(NaN);       // false
isNumberValue(Infinity);  // false
isNumberValue('42');      // false

// isNumberString - valid numeric strings
isNumberString('42');     // true
isNumberString('3.14');   // true
isNumberString('');       // false
isNumberString('   ');    // false
isNumberString('abc');    // false

// isNumeric - either number or numeric string
isNumeric(42);            // true
isNumeric('42');          // true
isNumeric(null);          // false
```

## Edge Cases

| Input | `isNumberValue` | `isNumberString` | `isNumeric` |
|-------|-----------------|------------------|-------------|
| `42` | ✅ | ❌ | ✅ |
| `'42'` | ❌ | ✅ | ✅ |
| `NaN` | ❌ | ❌ | ❌ |
| `Infinity` | ❌ | ❌ | ❌ |
| `''` | ❌ | ❌ | ❌ |
| `'   '` | ❌ | ❌ | ❌ |
| `null` | ❌ | ❌ | ❌ |
| `new Number(42)` | ❌ | ❌ | ❌ |

> **Note**
> `isNumeric` does NOT include `Number` objects. Use `isNumberObject` separately if needed.

## Use Cases

- **Form Validation**: Validate numeric input fields
- **Type Narrowing**: Let TypeScript know a value is a number
- **API Responses**: Safely handle mixed `number | string` data
- **Data Parsing**: Check before `parseInt` or `parseFloat`

## Example: Safe Numeric Parsing

```typescript
function parseValue(input: unknown): number | null {
  if (isNumberValue(input)) {
    return input; // Already a number
  }
  if (isNumberString(input)) {
    return parseFloat(input);
  }
  return null;
}

parseValue(42);     // 42
parseValue('3.14'); // 3.14
parseValue('abc');  // null
```

## Example: Type-Safe Calculation

```typescript
function double(value: unknown): number | null {
  if (isNumeric(value)) {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    return num * 2;
  }
  return null;
}
```

