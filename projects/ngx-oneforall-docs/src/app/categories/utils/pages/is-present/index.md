![Bundle Size](https://deno.bundlejs.com/badge?q=ngx-oneforall/utils/is-present&treeshake=[*]&config={"esbuild":{"external":["rxjs","@angular/core","@angular/common","@angular/forms","@angular/router"]}})

Type guard utility that checks if a value is neither `null` nor `undefined`. Narrows the type to `NonNullable<T>`.

## Usage

```typescript
import { isPresent } from 'ngx-oneforall/utils/is-present';
```

## API

`isPresent<T>(value: T): value is NonNullable<T>`

Returns `true` if value is not `null` and not `undefined`.

| Input | Result |
|-------|--------|
| `'hello'` | ✅ `true` |
| `0` | ✅ `true` |
| `false` | ✅ `true` |
| `''` | ✅ `true` |
| `null` | ❌ `false` |
| `undefined` | ❌ `false` |

> **Note**
> Falsy values like `0`, `false`, and `''` are considered "present" since they are not nullish.

## Example: Type Narrowing

```typescript
const value: string | null | undefined = getValue();

if (isPresent(value)) {
  console.log(value.toUpperCase()); // TypeScript knows value is string
}
```

## Example: Array Filtering

```typescript
const items = [1, null, 2, undefined, 3];
const filtered = items.filter(isPresent);
// filtered: number[] = [1, 2, 3]
```

## Example: Optional Chaining Alternative

```typescript
// Instead of:
if (user?.profile?.name !== undefined && user?.profile?.name !== null) {
  // ...
}

// Use:
if (isPresent(user?.profile?.name)) {
  // TypeScript narrows type correctly
}
```

## Use Cases

- **Array cleanup**: Filter out null/undefined from arrays
- **Type narrowing**: Let TypeScript know a value is defined
- **Form validation**: Check if optional values are present
- **API responses**: Safely access potentially null data

