`OmitByValue` is a utility type that constructs a new type by omitting properties from type `T` where the value extends type `V`. It combines `Omit` and `KeysOfType`.

## Usage

Use `OmitByValue` when you want to exclude properties of a specific type from an object.

```typescript
import { OmitByValue } from '@ngx-oneforall/types';

interface User {
    id: number;
    name: string;
    isActive: boolean;
    age: number;
    description: string;
}

// Result: { name: string; isActive: boolean; description: string; }
type NonNumericUserProps = OmitByValue<User, number>;
```

## API

`OmitByValue<T, V>`

- **T**: The source type.
- **V**: The type to omit values by.
