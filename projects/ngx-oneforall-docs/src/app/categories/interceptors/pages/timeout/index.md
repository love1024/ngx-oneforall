The `withTimeoutInterceptor` is an Angular HTTP interceptor designed to automatically add a timeout to outgoing HTTP requests. This helps prevent requests from hanging indefinitely and allows your application to handle slow network conditions gracefully.

## Features

- **Global Timeout**: Set a default timeout for all requests.
- **Request-Level Override**: Override the global timeout for specific requests using `HttpContext`.
- **Custom Error**: Throws a specialized `TimeoutError` including the original request metadata.

## Usage

### 1. Register the Interceptor

Register the interceptor in your application's `app.config.ts` (for standalone applications) or your `AppModule`.

```typescript
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { withTimeoutInterceptor } from '@ngx-oneforall/interceptors/timeout';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
      withInterceptors([
        withTimeoutInterceptor(5000) // Default timeout of 5 seconds
      ])
    )
  ]
};
```

### 2. Overriding Timeout for a Single Request

You can use the `withTimeout` helper to set a specific timeout for an individual request. This will override the global value set during registration.

```typescript
import { HttpClient } from '@angular/common/http';
import { withTimeout } from '@ngx-oneforall/interceptors/timeout';

@Component({ ... })
export class MyComponent {
  constructor(private http: HttpClient) {}

  fetchData() {
    this.http.get('https://api.example.com/data', {
      context: withTimeout({ timeout: 2000 }) // Override to 2 seconds
    }).subscribe({
      error: (error) => {
        if (error.name === 'TimeoutError') {
          console.error('The request timed out!');
        }
      }
    });
  }
}
```

## Demo

Here's an interactive demo showing the interceptor in action. The global timeout for this demo is set to **5000ms**.

{{ NgDocActions.demo("TimeoutInterceptorDemoComponent") }}

## Handling Timeout Errors

When a request times out, the interceptor throws an error object with the following structure:

- `name`: `'TimeoutError'`
- `message`: `Request timed out after [X]ms`
- `request`: The original `HttpRequest` object.

You can catch this error in your `subscribe` block or via other RxJS operators like `catchError`.

```typescript
import { TIMEOUT_ERROR } from '@ngx-oneforall/interceptors/timeout';
...
catchError((error) => {
  if (error.name === TIMEOUT_ERROR) {
    // Handle the timeout (e.g., show a toast or retry)
  }
  return throwError(() => error);
})
```
