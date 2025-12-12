`Callable` is a utility type that represents a function signature. It allows you to specify the argument types and return type.

## Usage

Use `Callable` when you need to define a generic function type with specific arguments or return type, essentially a shorthand for `{ (...args: Args): Return }`.

```typescript
import { Callable } from '@ngx-oneforall/types';

// Function taking any args and returning any
const fn: Callable = () => {};

// Function taking string and number, returning boolean
const specificFn: Callable<[string, number], boolean> = (str, num) => {
    return true;
};
```

## API

`Callable<Args extends any[] = any[], Return = any>`

- **Args**: Tuple definition of argument types. Default is `any[]`.
- **Return**: Return type. Default is `any`.
