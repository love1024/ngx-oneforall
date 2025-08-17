
The `JwtService` is a comprehensive Angular service for decoding and validating JSON Web Tokens (JWTs) in client applications. It provides a robust API for extracting claims, verifying token validity, and handling JWT-specific operations, making it ideal for authentication and authorization workflows.

#### Features

- **Decode JWT Header & Body:** Extract and parse the header and payload sections of a JWT.
- **Claim Retrieval:** Access specific claims (e.g., `exp`, `iat`, `nbf`, custom claims) from the token payload.
- **Expiration & Validity Checks:** Determine if a token is expired, not yet valid, or currently valid.
- **Time Calculations:** Compute the remaining time until token expiration.
- **Configurable Token Source:** Supports custom token retrieval logic via `tokenGetter` for flexible integration.

#### Usage

1. **Provide the Service:** Add `provideJwtService` in your Angular module or component providers, optionally passing `JwtOptions` for configuration.

```typescript
{
    ...
    providers: [provideJwtService({ tokenGetter: () => localStorage.getItem('access_token')})]
}
```

2. **Inject or Use Directly:** Use Angular's dependency injection or create an instance directly to access JWT utilities.


#### Example

```typescript{8}
export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const jwtService = inject(JwtService);
  const router = inject(Router);

  if (jwtService.isTokenExpired(token))) {
    router.navigateByUrl('/signin');
    return false;
  }

  return true;
};
```

#### API Overview

- **`decodeHeader<T>(token?: string): T`**  
        Decodes and returns the JWT header as an object.

- **`decodeBody<T extends JwtBody>(token?: string): T`**  
        Decodes and returns the JWT payload/body as an object.

- **`getClaim<T>(claim: string, token?: string): T | undefined`**  
        Retrieves the value of a specific claim from the payload.

- **`getExpirationDate(token?: string): Date | null`**  
        Returns the expiration date (`exp` claim) as a `Date` object.

- **`getIssuedAtDate(token?: string): Date | null`**  
        Returns the issued-at date (`iat` claim) as a `Date` object.

- **`isExpired(token?: string, offsetSeconds?: number): boolean`**  
        Checks if the token is expired, optionally with an offset.

- **`isNotYetValid(token?: string): boolean`**  
        Checks if the token is not yet valid (`nbf` claim).

- **`getTimeUntilExpiration(token?: string): number | null`**  
        Returns milliseconds until expiration, or `null` if not available.

- **`isValid(token?: string, offsetSeconds?: number): boolean`**  
        Returns `true` if the token is structurally valid, not expired, and not before its valid time.

#### JwtOptions

Configure token retrieval and service behavior:

- `tokenGetter`: `() => string`  
        Function to retrieve the JWT (e.g., from storage or cookies).

#### Notes

- The service does not perform cryptographic verification of JWT signatures.
- Designed for client-side decoding and validation of JWT structure and claims.
- Ensure tokens are securely stored and transmitted.



