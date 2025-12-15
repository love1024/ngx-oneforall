`isPresent` is a type guard utility that checks if a value is neither `null` nor `undefined`.

## Usage

Use `isPresent` to safely filter out nullish values from arrays or verify that a value exists before using it. It acts as a type guard, narrowing the type to `NonNullable<T>`.

### Example

```typescript
import { isPresent } from '@ngx-oneforall/utils';

const values = [1, null, 2, undefined, 3];
const definedValues = values.filter(isPresent); // Type is number[]
// definedValues: [1, 2, 3]

const value: string | null = 'hello';
if (isPresent(value)) {
    // value is typed as string here
    console.log(value.toUpperCase());
}
```

## API

`isPresent<T>(value: T): value is NonNullable<T>`

Returns `true` if the value is defined (not `null` and not `undefined`), otherwise `false`.
