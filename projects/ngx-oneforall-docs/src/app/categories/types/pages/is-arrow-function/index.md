`IsArrowFunction` is a utility type that determines if a given type is an arrow function. It returns `true` if the type is an arrow function (doesn't have a `this` context), and `false` otherwise.

## Usage

Use `IsArrowFunction` when you need to conditionally type based on whether a function is an arrow function or a standard function.

```typescript
import { IsArrowFunction } from '@ngx-oneforall/types';

const arrow = () => {};
function standard() {}

type CheckArrow = IsArrowFunction<typeof arrow>; // true
type CheckStandard = IsArrowFunction<typeof standard>; // false
```

## API

`IsArrowFunction<T>`

- **T**: The type to check.

Returns `true` or `false`.
