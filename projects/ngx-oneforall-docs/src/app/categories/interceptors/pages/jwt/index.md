The `jwtInterceptor` is a robust Angular HTTP interceptor designed to automatically attach JSON Web Tokens (JWT) to outgoing HTTP requests, streamlining authentication and authorization in Angular applications. This interceptor is essential for securing API calls and ensuring that only authenticated users can access protected resources.

## Why Use a JWT Interceptor?

In modern web applications, JWTs are commonly used for stateless authentication. Manually adding tokens to every HTTP request can be error-prone and repetitive. The `jwtInterceptor` automates this process, ensuring that tokens are consistently and securely included in requests to allowed domains, while providing flexibility to exclude specific routes or handle token expiration.

## How It Works

> **Alert**
> [JwtService](/services/jwt) (@ngxoneforall/services) is a mandatory dependency for JwtInterceptor. Please include that as well.

The `jwtInterceptor` operates as an Angular `HttpInterceptorFn`, intercepting outgoing HTTP requests and conditionally appending the JWT to the request headers. Its workflow includes:

1. **Platform Check**: Ensures interception only occurs in browser environments.
2. **Configuration Retrieval**: Fetches settings such as the authentication scheme, header name, allowed domains, and excluded routes from the `JwtService`.
3. **Token Extraction**: Obtains the JWT from the `JwtService`.
4. **Domain and Route Filtering**: 
    - **Allowed Domains**: Only attaches the token to requests targeting specified domains.
    - **Excluded Routes**: Skips token attachment for routes explicitly excluded.
5. **Token Validation**: 
    - Throws an error if a token is required but missing.
    - Optionally skips adding expired tokens.

## Usage Example

You need to include `JwtService` as well with Interceptor. The configuration options can be provided in the service

Register these in your Angular application's providers:

```typescript
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { jwtInterceptor } from '@ngx-oneforall/interceptors';
import { JwtService } from '@ngx-oneforall/services';

@NgModule({
  providers: [
    provideJwtService({
        tokenGetter: () => localStorage.get('access_token'),
        errorOnNoToken: true,
        allowedDomains: ['ngxoneforall.com', /gatherbits.com\/*/]
        ...Other options
    }),
    { provide: HTTP_INTERCEPTORS, useValue: jwtInterceptor, multi: true }
  ]
})
export class AppModule {}
```

or 

```typescript
import { provideHttpClient, withInterceptors} from '@angular/common/http';
import { jwtInterceptor } from '@ngx-oneforall/interceptors';

export const appConfig: ApplicationConfig = {
  providers: [
    provideJwtService({
        tokenGetter: () => localStorage.get('access_token'),
        errorOnNoToken: true,
        allowedDomains: ['ngxoneforall.com', /gatherbits.com\/*/]
        ...Other options
    }),
    provideHttpClient(withInterceptors([jwtInterceptor]))
  ]
}
```

## Configuration Options

The interceptor supports several configuration options via the `JwtService`:

- **authScheme**: Prefix for the token (default: `'Bearer '`).
- **headerName**: Name of the header to set (default: `'Authorization'`).
- **allowedDomains**: Array of domains or regular expressions where the token should be attached.
> **Alert**
> If no option is provided, then all domains are allowed by default.

    > **Warning**
    > The current origin is allowed by default as well.

- **skipUrls**: Array of URLs or regex patterns to exclude from token attachment.
- **errorOnNoToken**: Throws an error if no token is available.
- **skipAddingIfExpired**: Skips adding the token if it is expired.
- **refreshTokenHandler**: An optional handler that implements `RefreshTokenHandler` interface to automatically refresh tokens on 401 errors.

## Token Refresh Logic

The `jwtInterceptor` can automatically handle 401 Unauthorized errors by attempting to refresh the token. To enable this, provide a `refreshTokenHandler` in the configuration.

- **Automatic Refresh**: When a 401 error occurs, the interceptor calls `refreshToken()` on your handler.
- **Concurrency Handling**: If multiple requests fail with 401 concurrently, the interceptor will only trigger one refresh request. All other requests will wait for the new token and then retry.
- **Error Propagation**: If `refreshTokenHandler` is not provided, 401 errors are propagated to the subscriber as usual.
- **Logout**: If the refresh attempt fails, `logout()` is called on your handler.

```typescript
export interface RefreshTokenHandler {
  refreshToken(): Observable<string>;
  logout(): void;
}
```

## Skipping Interceptor

Sometimes you may want to bypass the `jwtInterceptor` for specific requests, such as the login request or the refresh token request itself to prevent infinite loops. You can use the `SKIP_JWT_INTERCEPTOR` context token for this purpose.

A helper function `withSkipJwtInterceptor()` is provided for convenience.

```typescript
import { withSkipJwtInterceptor } from '@ngx-oneforall/interceptors';

this.http.post('/api/auth/refresh', {}, { context: withSkipJwtInterceptor() }).subscribe();
```

## Benefits of Using jwtInterceptor

- **Automated Token Management**: Eliminates manual token handling for HTTP requests.
- **Fine-Grained Control**: Easily configure which requests should include the JWT.
- **Enhanced Security**: Ensures tokens are only sent to trusted domains and routes.
- **Seamless Integration**: Works transparently with Angular's HTTP client.

By integrating the `jwtInterceptor` into your Angular application, you can significantly improve the security and maintainability of your authentication logic, providing a seamless experience for both developers and users.

