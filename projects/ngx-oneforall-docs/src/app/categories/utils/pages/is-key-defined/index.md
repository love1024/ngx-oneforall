Type guard utility that checks if an object has a defined (non-undefined) value for a given key, with TypeScript type narrowing.

## Usage

```typescript
import { isKeyDefined } from 'ngx-oneforall/utils/is-key-defined';

const user = { name: 'John', age: undefined };

if (isKeyDefined(user, 'name')) {
  console.log(user.name.toUpperCase()); // TypeScript knows name is defined
}
```

## API

```typescript
isKeyDefined<T extends object, K extends keyof T>(
  obj: T,
  key: K,
  ownPropertyOnly?: boolean
): obj is T & Record<K, NonNullable<T[K]>>
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `obj` | `T` | - | The object to check |
| `key` | `keyof T` | - | The key to check for |
| `ownPropertyOnly` | `boolean` | `true` | Only check own properties, exclude inherited |

> **Note**
> This function acts as a type guard—when it returns `true`, TypeScript narrows the type to guarantee the key's value is non-nullable.

## Use Cases

- **Safe property access**: Prevent "cannot read property of undefined" errors
- **Form validation**: Verify required fields are present
- **API responses**: Safely access dynamic object properties
- **Type narrowing**: Let TypeScript know a property is defined

## Example: Including Inherited Properties

```typescript
class Base { inherited = 'value'; }
class Child extends Base { own = 'child'; }

const child = new Child();

// Default: only own properties
isKeyDefined(child, 'own');       // true
isKeyDefined(child, 'inherited'); // false (it's inherited)

// Include inherited
isKeyDefined(child, 'inherited', false); // true
```

## Example: Guarding Object Access

```typescript
interface Config {
  apiUrl?: string;
  timeout?: number;
}

function initializeApi(config: Config) {
  if (isKeyDefined(config, 'apiUrl')) {
    // TypeScript knows config.apiUrl is string, not undefined
    fetch(config.apiUrl);
  }
}
```
