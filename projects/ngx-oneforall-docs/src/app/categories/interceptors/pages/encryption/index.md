![Bundle Size](https://deno.bundlejs.com/badge?q=ngx-oneforall/interceptors/encryption&treeshake=[*]&config={"esbuild":{"external":["rxjs","@angular/core","@angular/common","@angular/forms","@angular/router"]}})

The `withEncryptionInterceptor` encrypts request bodies and decrypts response bodies using a configurable adapter.

## Features

- **Pluggable adapters** — Use any encryption library (CryptoJS, Web Crypto, etc.)
- **Bidirectional** — Encrypt requests and decrypt responses
- **Per-request control** — Disable via `HttpContext`
- **Error handling** — Configurable throw behavior on encryption/decryption errors
- **Header indication** — Adds header to indicate encrypted content

## Installation

```typescript
import { withEncryptionInterceptor, EncryptionAdapter } from 'ngx-oneforall/interceptors/encryption';
```

## Quick Start

### Create an Adapter

```typescript
const adapter: EncryptionAdapter = {
  encrypt: (data) => btoa(JSON.stringify(data)),
  decrypt: (data) => JSON.parse(atob(data as string))
};
```

### Register Interceptor

```typescript
provideHttpClient(
  withInterceptors([
    withEncryptionInterceptor({ adapter })
  ])
);
```

## Configuration

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `adapter` | `EncryptionAdapter` | **Required** | Encrypt/decrypt implementation |
| `enabled` | `boolean` | `true` | Enable encryption globally |
| `headerName` | `string` | `'X-Encrypted-Data'` | Header name for encrypted requests |
| `headerValue` | `string` | `'1'` | Header value when encrypted |
| `throwOnEncryptionError` | `boolean` | `true` | Throw if encryption fails |
| `throwOnDecryptionError` | `boolean` | `true` | Throw if decryption fails |

### EncryptionAdapter Interface

```typescript
interface EncryptionAdapter<T = unknown, E = unknown> {
  encrypt(data: T): E;
  decrypt(data: E): T;
}
```

## Error Handling

By default, errors during encryption/decryption are thrown. Set to `false` to fail silently:

```typescript
withEncryptionInterceptor({
  adapter,
  throwOnEncryptionError: false,  // Send unencrypted on failure
  throwOnDecryptionError: false   // Return raw response on failure
});
```

## Context API

```typescript
import { useEncryption } from 'ngx-oneforall/interceptors/encryption';
```

### Disable for a Request

```typescript
this.http.post('/api/public', data, {
  context: useEncryption({ enabled: false })
});
```

### Encrypt Only (No Decryption)

```typescript
this.http.post('/api/data', payload, {
  context: useEncryption({ decryptResponse: false })
});
```

### Context Options

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `enabled` | `boolean` | `true` | Enable/disable encryption |
| `encryptRequest` | `boolean` | `true` | Encrypt request body |
| `decryptResponse` | `boolean` | `true` | Decrypt response body |
| `context` | `HttpContext` | — | Extend existing context |

## Examples

### AES Encryption with CryptoJS

```typescript
import * as CryptoJS from 'crypto-js';

const aesAdapter: EncryptionAdapter = {
  encrypt: (data) => CryptoJS.AES.encrypt(JSON.stringify(data), SECRET).toString(),
  decrypt: (data) => JSON.parse(
    CryptoJS.AES.decrypt(data as string, SECRET).toString(CryptoJS.enc.Utf8)
  )
};
```

### Selective Encryption

```typescript
// Encrypt sensitive endpoints
this.http.put('/api/profile', profile);  // Encrypted

// Skip for public endpoints
this.http.get('/api/public', {
  context: useEncryption({ enabled: false })  // Not encrypted
});
```

> **Note**
> Always use HTTPS in addition to application-layer encryption.

> **Warning**
> The demo uses Base64 encoding for simplicity, which is NOT encryption. Use proper cryptographic algorithms in production.

## Demo

{{ NgDocActions.demo("EncryptionInterceptorDemoComponent") }}
