
The `CookieService` is a robust Angular service designed to manage browser cookies efficiently and securely. It provides a comprehensive API for reading, writing, and deleting cookies, supporting advanced options such as SameSite policies, domain, path, secure flags, and expiration settings.

#### Features

- **Read Cookies:** Retrieve the value of a specific cookie or all cookies as a key-value object.
- **Write Cookies:** Set cookies with customizable options, including expiration, path, domain, SameSite, secure, and partitioned attributes.
- **Delete Cookies:** Remove individual cookies or all cookies at once.
- **Browser-Only Execution:** Ensures cookie operations are performed only in browser environments.
- **Security Compliance:** Automatically enforces secure attributes when required by SameSite policies.

#### Usage

1. **Provide the Service:** Register `CookieService` in your Angular module or component using the `provideCookieService()` function.
2. **Inject the Service:** Use Angular's dependency injection to access `CookieService` in your components or services.

#### Example

```typescript
import { Component, inject } from '@angular/core';
import { CookieService, provideCookieService } from '@ngx-oneforall/services';

@Component({
    selector: 'app-cookie-demo',
    template: `
        <button (click)="setCookie()">Set Cookie</button>
        <button (click)="getCookie()">Get Cookie</button>
        <button (click)="deleteCookie()">Delete Cookie</button>
        <p>Cookie Value: {{ cookieValue }}</p>
    `,
    providers: [provideCookieService()],
})
export class CookieDemoComponent {
    private readonly cookieService = inject(CookieService);
    cookieValue = '';

    setCookie() {
        this.cookieService.set('user', 'JohnDoe', { sameSite: 'Lax', secure: true, expires: 3600 });
    }

    getCookie() {
        this.cookieValue = this.cookieService.get('user');
    }

    deleteCookie() {
        this.cookieService.delete('user');
        this.cookieValue = '';
    }
}
```

#### API Overview

- **`get(name: string): string`**  
    Returns the value of the specified cookie, or an empty string if not found.

- **`getAll(): Record<string, string>`**  
    Retrieves all cookies as an object with key-value pairs.

- **`set(name: string, value: string, options?: CookieOptions): void`**  
    Sets a cookie with the given name, value, and options.

- **`delete(name: string, options?: CookieOptions): void`**  
    Deletes the specified cookie.

- **`deleteAll(options?: CookieOptions): void`**  
    Deletes all cookies.

#### CookieOptions

Customize cookie behavior with the following options:

- `sameSite`: `'Strict' | 'Lax' | 'None'` (default: `'Lax'`)
- `domain`: string
- `path`: string
- `secure`: boolean
- `partitioned`: boolean
- `expires`: number (seconds) or `Date`

#### Notes

- The service is intended for use in browser environments only.
- When using `SameSite=None`, the `secure` flag is automatically enforced for security compliance.

#### Live Demo

Explore a live demonstration of cache service:

{{ NgDocActions.demo("CacheServiceDemoComponent") }}
