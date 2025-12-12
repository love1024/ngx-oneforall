`PickByValue` is a utility type that constructs a new type by picking properties from type `T` where the value extends type `V`. It combines `Pick` and `KeysOfType`.

## Usage

Use `PickByValue` when you want to create a new object type containing only properties of a specific type.

```typescript
import { PickByValue } from '@ngx-oneforall/types';

interface User {
    id: number;
    name: string;
    isActive: boolean;
    age: number;
}

// Result: { id: number; age: number; }
type NumericUserProps = PickByValue<User, number>;
```

## API

`PickByValue<T, V>`

- **T**: The source type.
- **V**: The type to filter values by.
