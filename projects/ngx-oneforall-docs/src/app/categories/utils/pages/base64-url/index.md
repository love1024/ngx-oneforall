![Bundle Size](https://deno.bundlejs.com/badge?q=ngx-oneforall/utils/base64&treeshake=[*]&config={"esbuild":{"external":["rxjs","@angular/core","@angular/common","@angular/forms","@angular/router"]}})

URL-safe Base64 encoding utilities for safely transmitting data in URLs, query parameters, and tokens.

## Usage

Import the functions from the base64 utility:

```typescript
import { base64UrlEncode, base64UrlDecode } from 'ngx-oneforall/utils/base64';
```

### Encoding

```typescript
const encoded = base64UrlEncode('Hello, 世界!');
// Result: "SGVsbG8sIOS4lueVjCE"
```

### Decoding

```typescript
const decoded = base64UrlDecode('SGVsbG8sIOS4lueVjCE');
// Result: "Hello, 世界!"
```

## API

| Function | Description |
|----------|-------------|
| `base64UrlEncode(value: string)` | Encodes a UTF-8 string to URL-safe base64 (RFC 4648) |
| `base64UrlDecode(value: string)` | Decodes a URL-safe base64 string to UTF-8 |

> **Note**
> These utilities correctly handle multi-byte Unicode characters (e.g., Chinese, emoji) using `TextEncoder`/`TextDecoder`.

## Use Cases

- **JWT Tokens**: Encode/decode JWT payload segments
- **Query Parameters**: Safely embed binary data in URLs
- **OAuth State**: Encode state parameters for OAuth flows
- **Data URIs**: Create URL-safe data identifiers

## Live Demo

{{ NgDocActions.demo("Base64UrlDemoComponent") }}