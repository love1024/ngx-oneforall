`KeysOfType` is a utility type that extracts the keys from a type `T` where the value extends the type `U`.

## Usage

Use `KeysOfType` to filter keys of an object based on their value types.

```typescript
import { KeysOfType } from 'ngx-oneforall/types';

interface User {
    id: number;
    name: string;
    isActive: boolean;
    age: number;
}

// Result: 'id' | 'age'
type NumberKeys = KeysOfType<User, number>;

// Result: 'name'
type StringKeys = KeysOfType<User, string>;
```

## API

`KeysOfType<T, U>`

- **T**: The source type to extract keys from.
- **U**: The type that the value must extend.
