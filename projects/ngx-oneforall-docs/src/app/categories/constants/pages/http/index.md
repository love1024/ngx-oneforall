The `ngx-oneforall/constants` package provides sets of constants for common HTTP methods and headers. Using these constants helps prevent typos and improves code maintainability.

## Usage

Import the constants from the constants package and use them in your HTTP requests or interceptors.

```typescript
import { HTTP_METHOD, HTTP_HEADER } from 'ngx-oneforall/constants';

// In an interceptor or service
const headers = new HttpHeaders({
  [HTTP_HEADER.ContentType]: 'application/json',
  [HTTP_HEADER.Authorization]: `Bearer ${token}`
});

this.http.request(HTTP_METHOD.POST, url, { headers, body });
```

## HTTP Methods

The `HTTP_METHOD` constant includes standard HTTP verbs.

| Name | Value |
| :--- | :--- |
| **GET** | `'GET'` |
| **POST** | `'POST'` |
| **PUT** | `'PUT'` |
| **PATCH** | `'PATCH'` |
| **DELETE** | `'DELETE'` |
| **OPTIONS** | `'OPTIONS'` |
| **HEAD** | `'HEAD'` |

## HTTP Headers

The `HTTP_HEADER` constant includes commonly used HTTP header names.

| Name | Value |
| :--- | :--- |
| **Authorization** | `'Authorization'` |
| **ContentType** | `'Content-Type'` |
| **Accept** | `'Accept'` |
| **CacheControl** | `'Cache-Control'` |
| **IfNoneMatch** | `'If-None-Match'` |
