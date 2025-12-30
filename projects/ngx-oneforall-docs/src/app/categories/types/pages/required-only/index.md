`RequiredOnly` is a utility type that makes specified properties of a type required, while removing all other properties. It effectively combines `Pick` and `Required`.

## Usage

Use `RequiredOnly` when you need a subset of a type where the selected properties must be present and non-optional.

```typescript
import { RequiredOnly } from 'ngx-oneforall/types';

interface User {
    id: number;
    name?: string;
    email?: string;
    age?: number;
}

// Result: { name: string; email: string; }
type UserContact = RequiredOnly<User, 'name' | 'email'>;
```

## API

`RequiredOnly<T, K extends keyof T>`

- **T**: The source type.
- **K**: The keys to pick and make required.
