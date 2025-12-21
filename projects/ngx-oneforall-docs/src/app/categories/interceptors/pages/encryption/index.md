The `withEncryptionInterceptor` is an Angular HTTP interceptor that automatically encrypts request payloads and decrypts response data using a configurable encryption adapter. This is essential for securing sensitive data transmitted between your Angular application and backend services.

## Why Use an Encryption Interceptor?

In applications that handle sensitive data, encrypting HTTP traffic at the application layer provides an additional security layer beyond HTTPS:

- **End-to-End Encryption**: Protect data even if intermediaries have access to HTTPS traffic
- **Compliance**: Meet regulatory requirements for data protection (GDPR, HIPAA, etc.)
- **Defense in Depth**: Add an extra layer of security beyond transport layer encryption
- **Selective Encryption**: Encrypt only specific endpoints or payloads as needed
- **Custom Algorithms**: Use your preferred encryption method with a pluggable adapter pattern

The `withEncryptionInterceptor` automates the encryption/decryption process, ensuring consistent security across all HTTP communications.

## How to Use

First, implement an encryption adapter that defines how data should be encrypted and decrypted:

```typescript
import { EncryptionAdapter } from '@ngx-oneforall/interceptors';

class AesEncryptionAdapter implements EncryptionAdapter {
  constructor(private secretKey: string) {}

  encrypt(data: unknown): unknown {
    // Implement AES encryption
    const jsonString = JSON.stringify(data);
    return CryptoJS.AES.encrypt(jsonString, this.secretKey).toString();
  }

  decrypt(data: unknown): unknown {
    // Implement AES decryption
    const decrypted = CryptoJS.AES.decrypt(data as string, this.secretKey);
    return JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));
  }
}
```

Then register the interceptor with your adapter:

```typescript
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { withEncryptionInterceptor } from '@ngx-oneforall/interceptors';

const encryptionAdapter = new AesEncryptionAdapter(environment.encryptionKey);

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
      withInterceptors([
        withEncryptionInterceptor({ adapter: encryptionAdapter })
      ])
    ),
  ],
};
```

or for NgModule-based applications:

```typescript
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { withEncryptionInterceptor } from '@ngx-oneforall/interceptors';

@NgModule({
  providers: [
    { 
      provide: HTTP_INTERCEPTORS, 
      useValue: withEncryptionInterceptor({ adapter: encryptionAdapter }), 
      multi: true 
    }
  ]
})
export class AppModule {}
```

## Configuration Options

The interceptor requires a configuration object with an encryption adapter:

| Option | Type | Required | Default | Description |
|--------|------|----------|---------|-------------|
| `adapter` | `EncryptionAdapter` | **Yes** | - | Implementation of encrypt/decrypt methods |
| `enabled` | `boolean` | No | `true` | Globally enable or disable encryption |
| `headerName` | `string` | No | `'X-Encrypted-Data'` | Header name to indicate encrypted payload |

> [!WARNING]
> The `adapter` is required. The interceptor will throw an error if it's not provided.

### EncryptionAdapter Interface

Your adapter must implement this interface:

```typescript
interface EncryptionAdapter {
  encrypt(data: unknown): unknown;
  decrypt(data: unknown): unknown;
}
```

## Behavior

The interceptor follows these rules:

1. **Request Encryption**: Encrypts the request body before sending (if not null)
2. **Response Decryption**: Decrypts the response body after receiving (if not null)
3. **Header Addition**: Adds the configured header to encrypted requests
4. **Null Safety**: Skips encryption/decryption for null bodies
5. **Context Override**: Per-request configuration takes precedence

## Context API

Control encryption behavior on a per-request basis using the `useEncryption` context function:

### Disable Encryption for Specific Requests

```typescript
import { useEncryption } from '@ngx-oneforall/interceptors';

// Skip encryption entirely for this request
this.http.post('/api/public', data, {
  context: useEncryption({ enabled: false })
});
```

### Disable Request Encryption Only

```typescript
// Decrypt response but don't encrypt request
this.http.get('/api/data', {
  context: useEncryption({ encryptRequest: false })
});
```

### Disable Response Decryption Only

```typescript
// Encrypt request but don't decrypt response
this.http.post('/api/data', payload, {
  context: useEncryption({ decryptResponse: false })
});
```

### Context Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `enabled` | `boolean` | `true` | Set to `false` to disable encryption/decryption |
| `encryptRequest` | `boolean` | `true` | Enable/disable request body encryption |
| `decryptResponse` | `boolean` | `true` | Enable/disable response body decryption |
| `context` | `HttpContext` | - | Use an existing HttpContext object |

## Use Cases

### Secure Medical Records

```typescript
import * as CryptoJS from 'crypto-js';

class MedicalDataAdapter implements EncryptionAdapter {
  constructor(private key: string) {}

  encrypt(data: unknown): unknown {
    const json = JSON.stringify(data);
    return CryptoJS.AES.encrypt(json, this.key).toString();
  }

  decrypt(data: unknown): unknown {
    const decrypted = CryptoJS.AES.decrypt(data as string, this.key);
    return JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));
  }
}

// Usage
export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
      withInterceptors([
        withEncryptionInterceptor({
          adapter: new MedicalDataAdapter(environment.hipaaKey)
        })
      ])
    ),
  ],
};
```

### Financial Transactions

```typescript
class PaymentEncryptionAdapter implements EncryptionAdapter {
  encrypt(data: unknown): unknown {
    // Use PGP or RSA for financial data
    return this.pgpEncrypt(JSON.stringify(data));
  }

  decrypt(data: unknown): unknown {
    return JSON.parse(this.pgpDecrypt(data as string));
  }

  private pgpEncrypt(data: string): string {
    // Implement PGP encryption
  }

  private pgpDecrypt(data: string): string {
    // Implement PGP decryption
  }
}
```

### Environment-Specific Encryption

```typescript
// development.ts
export const environment = {
  adapter: new Base64Adapter(), // Simple for dev
};

// production.ts
export const environment = {
  adapter: new AesAdapter(secrets.encryptionKey), // Secure for prod
};

// app.config.ts
export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
      withInterceptors([
        withEncryptionInterceptor({ adapter: environment.adapter })
      ])
    ),
  ],
};
```

### Selective Endpoint Encryption

```typescript
class SecureApiService {
  // Encrypt sensitive user data
  updateProfile(profile: UserProfile) {
    return this.http.put('/api/profile', profile);
    // Automatically encrypted by interceptor
  }

  // Don't encrypt public data
  getPublicContent() {
    return this.http.get('/api/public', {
      context: useEncryption({ enabled: false })
    });
  }
}
```

## Security Considerations

> [!IMPORTANT]
> Best practices for using the encryption interceptor:

- **Use Strong Algorithms**: Implement adapters with AES-256, RSA, or other proven algorithms
- **Secure Key Management**: Never hardcode encryption keys; use environment variables or secrets management
- **Key Rotation**: Implement a strategy for rotating encryption keys periodically
- **Transport Security**: Always use HTTPS in addition to application-layer encryption
- **Validate Server**: Ensure the server can decrypt the payloads and encrypt responses

> [!CAUTION]
> The demo uses Base64 encoding for simplicity, which is NOT encryption. Always use proper cryptographic algorithms in production.

## Demo

Explore a live demonstration of the encryption interceptor:

{{ NgDocActions.demo("EncryptionInterceptorDemoComponent") }}
