Decode, validate, and extract claims from JSON Web Tokens (JWTs) with a configurable token source.

## Features

- **Decode JWT** — Extract header and payload without verification
- **Claim Access** — Get individual claims with type safety
- **Validity Checks** — Check expiration, not-yet-valid, and overall validity
- **Configurable Token Source** — Provide custom `tokenGetter` function
- **Error Handling** — Clear errors for missing, malformed, or invalid tokens

---

## Installation

```typescript
import { JwtService, provideJwtService } from '@ngx-oneforall/services/jwt';
```

---

## Basic Usage

```typescript
import { Component, inject } from '@angular/core';
import { JwtService, provideJwtService } from '@ngx-oneforall/services/jwt';

@Component({
  selector: 'app-demo',
  template: `<p>Token valid: {{ isValid }}</p>`,
  providers: [
    provideJwtService({
      tokenGetter: () => localStorage.getItem('access_token') ?? '',
    }),
  ],
})
export class DemoComponent {
  private jwt = inject(JwtService);
  isValid = this.jwt.isValid();
}
```

---

## API Reference

| Method | Returns | Description |
|--------|---------|-------------|
| `decodeHeader<T>(token?)` | `T` | Decode and return JWT header |
| `decodeBody<T>(token?)` | `T` | Decode and return JWT payload |
| `getClaim<T>(claim, token?)` | `T \| undefined` | Get specific claim value |
| `getExpirationDate(token?)` | `Date \| null` | Get `exp` claim as Date |
| `getIssuedAtDate(token?)` | `Date \| null` | Get `iat` claim as Date |
| `isExpired(token?, offset?)` | `boolean` | Check if token is expired |
| `isNotYetValid(token?)` | `boolean` | Check `nbf` claim |
| `isValid(token?, offset?)` | `boolean` | Check structure + expiration + nbf |
| `getTimeUntilExpiration(token?)` | `number \| null` | Milliseconds until expiration |
| `getToken()` | `string` | Get token from tokenGetter |
| `getConfig()` | `JwtOptions` | Get service configuration |

---

## Configuration

```typescript
interface JwtOptions {
  tokenGetter?: () => string | null;
  authScheme?: string;           // Default: 'Bearer '
  headerName?: string;           // Default: 'Authorization'
  errorOnNoToken?: boolean;
  skipAddingIfExpired?: boolean;
  allowedDomains?: (string | RegExp)[];
  skipUrls?: (string | RegExp)[];
  refreshTokenHandler?: RefreshTokenHandler;
}
```

---

## Auth Guard Example

```typescript
export const authGuard: CanActivateFn = () => {
  const jwt = inject(JwtService);
  const router = inject(Router);

  if (jwt.isExpired()) {
    router.navigateByUrl('/login');
    return false;
  }
  return true;
};
```

---

## SSR Considerations

> **Note**
> The service itself is SSR-safe, but your `tokenGetter` must handle server environments:

```typescript
// ✅ SSR-safe tokenGetter
provideJwtService({
  tokenGetter: () => {
    if (typeof localStorage === 'undefined') return '';
    return localStorage.getItem('token') ?? '';
  }
})

// ✅ Better: Use cookies (available on server)
provideJwtService({
  tokenGetter: () => cookieService.get('access_token')
})
```

---

## Error Handling

The service throws descriptive errors:

| Error | Cause |
|-------|-------|
| `'Token is missing.'` | Empty token from `tokenGetter` |
| `'Token is not a valid JWT.'` | Token doesn't have 3 dot-separated parts |
| `'Failed to decode JWT header.'` | Invalid base64 or JSON in header |
| `'Failed to decode JWT payload.'` | Invalid base64 or JSON in payload |

---

## Security Notes

> **Warning**
> This service **does not verify JWT signatures**. It only decodes and validates structure/claims. Signature verification should be done server-side.
