![Bundle Size](https://deno.bundlejs.com/badge?q=ngx-oneforall/utils/hash&treeshake=[*]&config={"esbuild":{"external":["rxjs","@angular/core","@angular/common","@angular/forms","@angular/router"]}})

Fast, non-cryptographic string hashing utilities for generating numeric hash codes.

## Usage

```typescript
import { hashCode, hashCodeWithSalt } from 'ngx-oneforall/utils/hash';
```

### Basic Hashing

```typescript
const hash = hashCode('hello');
// hash: -1794106052
```

### Salted Hashing

```typescript
const hash = hashCodeWithSalt('hello', 'my-secret-salt');
// Different result than hashCode('hello')
```

## API

| Function | Description |
|----------|-------------|
| `hashCode(str: string)` | Generates a 32-bit signed integer hash |
| `hashCodeWithSalt(str: string, salt: string)` | Generates a salted hash using the salt's hash as seed |

## Algorithm

Uses the DJB2-like algorithm, equivalent to Java's `String.hashCode()`:

```
hash = ((hash << 5) - hash + charCode) | 0
     = (hash * 31 + charCode) | 0
```

The `| 0` ensures 32-bit signed integer truncation.

## Use Cases

- **Cache Keys**: Generate numeric keys for caching mechanisms
- **Hash Tables**: Distribute objects across buckets
- **Quick Comparison**: Fast string equality pre-check
- **Partitioning**: Consistent assignment to shards/partitions

> **Note**
> This is a non-cryptographic hash. Do not use for passwords, security tokens, or any security-sensitive application. Use `crypto` or `bcrypt` instead.

## Example: Cache Key Generation

```typescript
function getCacheKey(userId: string, resource: string): number {
  return hashCode(`${userId}:${resource}`);
}

const key = getCacheKey('user-123', 'profile');
cache.set(key, data);
```

## Example: Consistent Partitioning

```typescript
function getPartition(key: string, partitionCount: number): number {
  return Math.abs(hashCode(key)) % partitionCount;
}

const partition = getPartition('order-456', 8);
// Always returns same partition for same key
```

