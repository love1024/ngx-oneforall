`PartialOnly` is a utility type that picks specified properties from a type and makes them optional, while removing all other properties. It effectively combines `Pick` and `Partial`.

## Usage

Use `PartialOnly` when you need a subset of a type where the selected properties should be optional.

```typescript
import { PartialOnly } from 'ngx-oneforall/types';

interface User {
    id: number;
    name: string;
    email: string;
    age: number;
}

// Result: { name?: string; email?: string; }
type UserUpdate = PartialOnly<User, 'name' | 'email'>;
```

## API

`PartialOnly<T, K extends keyof T>`

- **T**: The source type.
- **K**: The keys to pick and make partial.
