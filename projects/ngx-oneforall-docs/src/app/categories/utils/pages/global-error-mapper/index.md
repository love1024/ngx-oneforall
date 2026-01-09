[![Bundle Size](https://deno.bundlejs.com/badge?q=ngx-oneforall/utils/global-error-mapper&treeshake=[*]&config={"esbuild":{"external":["rxjs","@angular/core","@angular/common","@angular/forms","@angular/router"]}})](https://bundlejs.com/?q=ngx-oneforall/utils/global-error-mapper)

A centralized error mapping utility that transforms errors from APIs, runtime failures, and business logic into standardized, user-friendly error objects.

## Features

- Standardizes errors from HTTP, runtime, and business logic
- Separates user-facing messages from developer/debug information
- Configurable HTTP status code mappings
- Custom error mapper support
- Type-safe with full TypeScript support
- Integrates with interceptors and global error handlers

## Basic Usage

```typescript
import { mapError } from 'ngx-oneforall/utils/global-error-mapper';

// In a service or component
try {
  await this.apiService.fetchData();
} catch (error) {
  const mapped = mapError(error);

  // Show user-friendly message in UI
  this.toast.show(mapped.userMessage);

  // Log detailed info for debugging
  console.error(mapped.devMessage);
}
```

## MappedError Structure

| Property | Type | Description |
|----------|------|-------------|
| `code` | `string` | Unique error code (e.g., `HTTP_401`, `TYPE_ERROR`) |
| `userMessage` | `string` | User-friendly message safe for UI |
| `devMessage` | `string` | Technical details for debugging |
| `severity` | `'info' \| 'warning' \| 'error' \| 'critical'` | Error severity level |
| `category` | `'network' \| 'auth' \| 'validation' \| ...` | Error category |
| `statusCode` | `number?` | HTTP status code (if applicable) |
| `originalError` | `unknown` | Original error object |
| `timestamp` | `number` | Unix timestamp when mapped |
| `context` | `TContext?` | Optional context data |
| `recoverable` | `boolean` | Whether retry is possible |
| `suggestedAction` | `string?` | Suggested user action |

## HTTP Error Mapping

Built-in mappings for common HTTP status codes:

| Status | User Message | Category | Recoverable |
|--------|-------------|----------|-------------|
| 400 | "The request could not be processed..." | validation | Yes |
| 401 | "Please log in to continue." | auth | Yes |
| 403 | "You do not have permission..." | auth | No |
| 404 | "The requested resource was not found." | client | No |
| 500 | "An unexpected error occurred..." | server | Yes |
| 502/503/504 | "The server is temporarily unavailable..." | server | Yes |

## Configuration

Configure the mapper once during application initialization:

```typescript
import {
  configureErrorMapper,
  ErrorSeverity,
  ErrorCategory
} from 'ngx-oneforall/utils/global-error-mapper';

// In app.config.ts or main.ts
configureErrorMapper({
  // Custom HTTP status mappings
  httpMappings: {
    418: {
      userMessage: "I'm a teapot!",
      severity: ErrorSeverity.Info,
      category: ErrorCategory.Business,
      recoverable: false,
    },
  },

  // Custom error mappers (checked in order)
  customMappers: [
    (error) => {
      if (error instanceof PaymentDeclinedError) {
        return {
          code: 'PAYMENT_DECLINED',
          userMessage: 'Payment was declined.',
          category: ErrorCategory.Business,
          severity: ErrorSeverity.Warning,
          recoverable: true,
        };
      }
      return null;
    },
  ],

  // Default message for unmapped errors
  defaultUserMessage: 'Oops! Something went wrong.',

  // Include stack traces in devMessage
  includeStackTrace: true,
});
```

## Integration Examples

### HTTP Interceptor

```typescript
import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { mapError } from 'ngx-oneforall/utils/global-error-mapper';

export const errorMapperInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError(error => {
      const mapped = mapError(error);

      // Log or report error
      console.error(`[${mapped.code}]`, mapped.devMessage);

      // Re-throw mapped error
      return throwError(() => mapped);
    })
  );
};
```

### Global Error Handler

```typescript
import { ErrorHandler, Injectable } from '@angular/core';
import { mapError, isMappedError } from 'ngx-oneforall/utils/global-error-mapper';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  handleError(error: unknown): void {
    // Avoid double-mapping
    const mapped = isMappedError(error) ? error : mapError(error);

    // Log to monitoring service
    this.logger.error(mapped.devMessage, {
      code: mapped.code,
      category: mapped.category,
      severity: mapped.severity,
    });

    // Show notification for critical errors
    if (mapped.severity === 'critical') {
      this.notificationService.error(mapped.userMessage);
    }
  }
}
```

### Form Validation Errors

```typescript
import {
  mapError,
  extractValidationErrors
} from 'ngx-oneforall/utils/global-error-mapper';

// Extract field-level validation errors from 400/422 responses
try {
  await this.userService.updateProfile(data);
} catch (error) {
  const validationErrors = extractValidationErrors(error);

  if (validationErrors) {
    // Apply to reactive form
    Object.entries(validationErrors).forEach(([field, message]) => {
      this.form.get(field)?.setErrors({ server: message });
    });
  } else {
    // Handle non-validation errors
    const mapped = mapError(error);
    this.toast.error(mapped.userMessage);
  }
}
```

## Custom Error Classes

Create error classes that integrate with the mapper:

```typescript
import {
  createMappableError,
  createErrorMapping,
  configureErrorMapper,
  ErrorCategory,
  ErrorSeverity,
} from 'ngx-oneforall/utils/global-error-mapper';

// Option 1: Create a mappable error class
const ValidationError = createMappableError({
  code: 'VALIDATION_ERROR',
  category: ErrorCategory.Validation,
  severity: ErrorSeverity.Warning,
  recoverable: true,
});

throw new ValidationError('Email is invalid', {
  userMessage: 'Please enter a valid email address.',
  context: { field: 'email' },
});

// Option 2: Register existing error class
class PaymentError extends Error {
  constructor(public reason: string) {
    super(`Payment failed: ${reason}`);
  }
}

configureErrorMapper({
  customMappers: [
    createErrorMapping(PaymentError, (error) => ({
      code: 'PAYMENT_FAILED',
      userMessage: 'Payment could not be processed.',
      category: ErrorCategory.Business,
      context: { reason: error.reason },
    })),
  ],
});
```

## Utility Functions

### Type Guard

```typescript
import { isMappedError } from 'ngx-oneforall/utils/global-error-mapper';

if (isMappedError(error)) {
  console.log(error.userMessage); // TypeScript knows this is MappedError
}
```

### Reset Configuration

```typescript
import { resetErrorMapperConfig } from 'ngx-oneforall/utils/global-error-mapper';

// Useful for testing
resetErrorMapperConfig();
```

### Get Current Config

```typescript
import { getErrorMapperConfig } from 'ngx-oneforall/utils/global-error-mapper';

const config = getErrorMapperConfig();
console.log(config.defaultUserMessage);
```

## Demo

{{ NgDocActions.demo("GlobalErrorMapperDemoComponent") }}

## Best Practices

1. **Configure once at startup** - Call `configureErrorMapper()` in your app initialization
2. **Use interceptors** - Map HTTP errors centrally in an interceptor
3. **Check `isMappedError` first** - Avoid double-mapping errors that are already mapped
4. **Log `devMessage`, show `userMessage`** - Keep technical details out of the UI
5. **Use `recoverable` flag** - Show retry buttons only for recoverable errors
6. **Leverage `category`** - Route errors to appropriate handlers based on category

