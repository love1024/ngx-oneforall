`DeepPartial` is a utility type that recursively makes all properties of a type and its nested objects optional. This is similar to `Partial<T>`, but applies deeply.

## Usage

Use `DeepPartial` when you need to construct an object that might only have some deep properties defined, for example when mocking data in tests or applying partial updates.

```typescript
import { DeepPartial } from 'ngx-oneforall/types';

interface Config {
    theme: {
        color: string;
        darkMode: boolean;
    };
    api: {
        endpoint: string;
        retries: number;
    };
}

// Valid
const partialConfig: DeepPartial<Config> = {
    theme: {
        darkMode: true
    }
    // api can be undefined
    // theme.color can be undefined
};
```

## API

`DeepPartial<T>`

- **T**: The source type to make deeply partial.
