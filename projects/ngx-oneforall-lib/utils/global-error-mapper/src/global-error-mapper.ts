import { HttpErrorResponse } from '@angular/common/http';

/**
 * Error severity levels for categorizing errors.
 */
export const ErrorSeverity = {
  /** Informational - no action required */
  Info: 'info',
  /** Warning - may require attention */
  Warning: 'warning',
  /** Error - requires attention */
  Error: 'error',
  /** Critical - requires immediate attention */
  Critical: 'critical',
} as const;

export type ErrorSeverityType =
  (typeof ErrorSeverity)[keyof typeof ErrorSeverity];

/**
 * Error categories for grouping related errors.
 */
export const ErrorCategory = {
  /** Network-related errors (connection, timeout, etc.) */
  Network: 'network',
  /** Authentication/Authorization errors */
  Auth: 'auth',
  /** Validation errors (form, input, etc.) */
  Validation: 'validation',
  /** Business logic errors */
  Business: 'business',
  /** Server-side errors */
  Server: 'server',
  /** Client-side errors */
  Client: 'client',
  /** Unknown/unhandled errors */
  Unknown: 'unknown',
} as const;

export type ErrorCategoryType =
  (typeof ErrorCategory)[keyof typeof ErrorCategory];

/**
 * Standardized error object returned by the error mapper.
 */
export interface MappedError<TContext = unknown> {
  /** Unique error code for identification */
  code: string;
  /** User-friendly message safe to display in UI */
  userMessage: string;
  /** Technical message for developers/logs */
  devMessage: string;
  /** Error severity level */
  severity: ErrorSeverityType;
  /** Error category for grouping */
  category: ErrorCategoryType;
  /** HTTP status code (if applicable) */
  statusCode?: number;
  /** Original error object for debugging */
  originalError: unknown;
  /** Unix timestamp when error was mapped */
  timestamp: number;
  /** Optional context data for additional information */
  context?: TContext;
  /** Whether the error is recoverable (e.g., retry possible) */
  recoverable: boolean;
  /** Suggested action for the user (optional) */
  suggestedAction?: string;
}

/**
 * Custom error mapping function type.
 */
export type ErrorMappingFn<TContext = unknown> = (
  error: unknown
) => Partial<MappedError<TContext>> | null;

/**
 * Configuration for HTTP status code mappings.
 */
export interface HttpStatusMapping {
  /** User-friendly message */
  userMessage: string;
  /** Error severity */
  severity?: ErrorSeverityType;
  /** Error category */
  category?: ErrorCategoryType;
  /** Whether the error is recoverable */
  recoverable?: boolean;
  /** Suggested action */
  suggestedAction?: string;
}

/**
 * Configuration options for the Global Error Mapper.
 */
export interface GlobalErrorMapperConfig<TContext = unknown> {
  /** Custom HTTP status code mappings */
  httpMappings?: Record<number, HttpStatusMapping>;
  /** Custom error mapping functions (checked in order) */
  customMappers?: ErrorMappingFn<TContext>[];
  /** Default user message for unmapped errors */
  defaultUserMessage?: string;
  /** Whether to include stack trace in devMessage */
  includeStackTrace?: boolean;
  /** Custom context extractor function */
  contextExtractor?: (error: unknown) => TContext | undefined;
}

/**
 * Default HTTP status code mappings.
 */
const DEFAULT_HTTP_MAPPINGS: Record<number, HttpStatusMapping> = {
  // Client errors (4xx)
  400: {
    userMessage: 'The request could not be processed. Please check your input.',
    severity: ErrorSeverity.Warning,
    category: ErrorCategory.Validation,
    recoverable: true,
    suggestedAction: 'Please review your input and try again.',
  },
  401: {
    userMessage: 'Please log in to continue.',
    severity: ErrorSeverity.Warning,
    category: ErrorCategory.Auth,
    recoverable: true,
    suggestedAction: 'Please log in and try again.',
  },
  403: {
    userMessage: 'You do not have permission to perform this action.',
    severity: ErrorSeverity.Warning,
    category: ErrorCategory.Auth,
    recoverable: false,
    suggestedAction: 'Contact support if you believe this is an error.',
  },
  404: {
    userMessage: 'The requested resource was not found.',
    severity: ErrorSeverity.Warning,
    category: ErrorCategory.Client,
    recoverable: false,
  },
  408: {
    userMessage: 'The request timed out. Please try again.',
    severity: ErrorSeverity.Warning,
    category: ErrorCategory.Network,
    recoverable: true,
    suggestedAction: 'Please try again.',
  },
  409: {
    userMessage: 'A conflict occurred. The resource may have been modified.',
    severity: ErrorSeverity.Warning,
    category: ErrorCategory.Business,
    recoverable: true,
    suggestedAction: 'Refresh and try again.',
  },
  422: {
    userMessage: 'The data provided is invalid.',
    severity: ErrorSeverity.Warning,
    category: ErrorCategory.Validation,
    recoverable: true,
    suggestedAction: 'Please correct the errors and try again.',
  },
  429: {
    userMessage: 'Too many requests. Please wait a moment and try again.',
    severity: ErrorSeverity.Warning,
    category: ErrorCategory.Client,
    recoverable: true,
    suggestedAction: 'Please wait a moment before retrying.',
  },
  // Server errors (5xx)
  500: {
    userMessage: 'An unexpected error occurred. Please try again later.',
    severity: ErrorSeverity.Error,
    category: ErrorCategory.Server,
    recoverable: true,
    suggestedAction: 'Please try again later.',
  },
  501: {
    userMessage: 'This feature is not yet available.',
    severity: ErrorSeverity.Info,
    category: ErrorCategory.Server,
    recoverable: false,
  },
  502: {
    userMessage: 'The server is temporarily unavailable. Please try again.',
    severity: ErrorSeverity.Error,
    category: ErrorCategory.Server,
    recoverable: true,
    suggestedAction: 'Please try again in a few moments.',
  },
  503: {
    userMessage:
      'The service is temporarily unavailable. Please try again later.',
    severity: ErrorSeverity.Error,
    category: ErrorCategory.Server,
    recoverable: true,
    suggestedAction: 'Please try again later.',
  },
  504: {
    userMessage: 'The server took too long to respond. Please try again.',
    severity: ErrorSeverity.Error,
    category: ErrorCategory.Network,
    recoverable: true,
    suggestedAction: 'Please try again.',
  },
};

/**
 * Default configuration for the error mapper.
 */
const DEFAULT_CONFIG: GlobalErrorMapperConfig = {
  httpMappings: {},
  customMappers: [],
  defaultUserMessage: 'An unexpected error occurred. Please try again.',
  includeStackTrace: true,
};

/**
 * Global configuration instance (singleton pattern).
 */
let globalConfig: GlobalErrorMapperConfig = { ...DEFAULT_CONFIG };

/**
 * Configures the global error mapper with custom settings.
 * Call this once during application initialization.
 *
 * @param config - Configuration options to merge with defaults
 *
 * @example
 * ```typescript
 * // In app.config.ts or main.ts
 * configureErrorMapper({
 *   httpMappings: {
 *     418: {
 *       userMessage: "I'm a teapot!",
 *       severity: 'info',
 *       category: 'business',
 *       recoverable: false,
 *     },
 *   },
 *   customMappers: [
 *     (error) => {
 *       if (error instanceof CustomBusinessError) {
 *         return {
 *           code: 'BUSINESS_ERROR',
 *           userMessage: error.userMessage,
 *           category: 'business',
 *         };
 *       }
 *       return null;
 *     },
 *   ],
 *   defaultUserMessage: 'Oops! Something went wrong.',
 * });
 * ```
 */
export function configureErrorMapper<TContext = unknown>(
  config: GlobalErrorMapperConfig<TContext>
): void {
  globalConfig = {
    ...DEFAULT_CONFIG,
    ...config,
    httpMappings: {
      ...DEFAULT_CONFIG.httpMappings,
      ...config.httpMappings,
    },
  };
}

/**
 * Resets the error mapper configuration to defaults.
 * Useful for testing or resetting state.
 */
export function resetErrorMapperConfig(): void {
  globalConfig = { ...DEFAULT_CONFIG };
}

/**
 * Gets the current error mapper configuration.
 * Useful for debugging or extending functionality.
 */
export function getErrorMapperConfig(): GlobalErrorMapperConfig {
  return { ...globalConfig };
}

/**
 * Generates a unique error code based on error type and status.
 */
function generateErrorCode(error: unknown, statusCode?: number): string {
  if (statusCode) {
    return `HTTP_${statusCode}`;
  }

  if (error instanceof TypeError) {
    return 'TYPE_ERROR';
  }
  if (error instanceof ReferenceError) {
    return 'REFERENCE_ERROR';
  }
  if (error instanceof SyntaxError) {
    return 'SYNTAX_ERROR';
  }
  if (error instanceof RangeError) {
    return 'RANGE_ERROR';
  }
  if (error instanceof Error) {
    return `ERROR_${error.name.toUpperCase().replace(/\s+/g, '_')}`;
  }

  return 'UNKNOWN_ERROR';
}

/**
 * Extracts a developer-friendly message from any error type.
 */
function extractDevMessage(error: unknown, includeStack: boolean): string {
  if (error instanceof HttpErrorResponse) {
    const body =
      typeof error.error === 'string'
        ? error.error
        : JSON.stringify(error.error);
    return `HTTP ${error.status}: ${error.message}. Body: ${body}`;
  }

  if (error instanceof Error) {
    let message = `${error.name}: ${error.message}`;
    if (includeStack && error.stack) {
      message += `\nStack: ${error.stack}`;
    }
    return message;
  }

  if (typeof error === 'string') {
    return error;
  }

  try {
    return JSON.stringify(error);
  } catch {
    return String(error);
  }
}

/**
 * Checks if an error is a network connectivity error.
 */
function isNetworkError(error: unknown): boolean {
  if (error instanceof HttpErrorResponse) {
    // Status 0 typically indicates network failure
    return error.status === 0;
  }

  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    return (
      message.includes('network') ||
      message.includes('fetch') ||
      message.includes('connection') ||
      message.includes('offline')
    );
  }

  return false;
}

/**
 * Maps an HTTP error response to a standardized error.
 */
function mapHttpError<TContext>(
  error: HttpErrorResponse,
  config: GlobalErrorMapperConfig<TContext>
): Partial<MappedError<TContext>> {
  // Check for network errors first
  if (isNetworkError(error)) {
    return {
      code: 'NETWORK_ERROR',
      userMessage: 'Unable to connect. Please check your internet connection.',
      severity: ErrorSeverity.Error,
      category: ErrorCategory.Network,
      statusCode: 0,
      recoverable: true,
      suggestedAction: 'Check your connection and try again.',
    };
  }

  // Check custom mappings first, then default mappings
  const customMapping = config.httpMappings?.[error.status];
  const defaultMapping = DEFAULT_HTTP_MAPPINGS[error.status];
  const mapping = customMapping ?? defaultMapping;

  if (mapping) {
    return {
      code: `HTTP_${error.status}`,
      userMessage: mapping.userMessage,
      severity: mapping.severity ?? ErrorSeverity.Error,
      category: mapping.category ?? ErrorCategory.Server,
      statusCode: error.status,
      recoverable: mapping.recoverable ?? false,
      suggestedAction: mapping.suggestedAction,
    };
  }

  // Handle unmapped status codes by range
  if (error.status >= 400 && error.status < 500) {
    return {
      code: `HTTP_${error.status}`,
      userMessage: 'The request could not be completed.',
      severity: ErrorSeverity.Warning,
      category: ErrorCategory.Client,
      statusCode: error.status,
      recoverable: true,
    };
  }

  if (error.status >= 500) {
    return {
      code: `HTTP_${error.status}`,
      userMessage: 'A server error occurred. Please try again later.',
      severity: ErrorSeverity.Error,
      category: ErrorCategory.Server,
      statusCode: error.status,
      recoverable: true,
    };
  }

  return {
    code: `HTTP_${error.status}`,
    statusCode: error.status,
  };
}

/**
 * Maps any error to a standardized MappedError object.
 *
 * @description
 * Provides a centralized way to handle errors across the application.
 * Transforms errors from APIs, runtime failures, and business logic
 * into consistent, user-friendly error objects.
 *
 * @param error - Any error object (Error, HttpErrorResponse, string, etc.)
 * @param overrides - Optional partial overrides for the mapped error
 * @returns A standardized MappedError object
 *
 * @example
 * ```typescript
 * // Basic usage
 * try {
 *   await fetchData();
 * } catch (error) {
 *   const mapped = mapError(error);
 *   showToast(mapped.userMessage);
 *   console.error(mapped.devMessage);
 * }
 * ```
 *
 * @example
 * ```typescript
 * // With context and overrides
 * const mapped = mapError(error, {
 *   context: { userId: 123, action: 'save' },
 *   suggestedAction: 'Please refresh and try again.',
 * });
 * ```
 *
 * @example
 * ```typescript
 * // In an HTTP interceptor
 * catchError((error: HttpErrorResponse) => {
 *   const mapped = mapError(error);
 *   errorService.handle(mapped);
 *   return throwError(() => mapped);
 * })
 * ```
 *
 * @example
 * ```typescript
 * // In a global error handler
 * @Injectable()
 * export class GlobalErrorHandler implements ErrorHandler {
 *   handleError(error: unknown): void {
 *     const mapped = mapError(error);
 *     this.logger.error(mapped.devMessage);
 *     if (mapped.severity === 'critical') {
 *       this.alertService.notify(mapped.userMessage);
 *     }
 *   }
 * }
 * ```
 */
export function mapError<TContext = unknown>(
  error: unknown,
  overrides?: Partial<MappedError<TContext>>
): MappedError<TContext> {
  const config = globalConfig as GlobalErrorMapperConfig<TContext>;
  const timestamp = Date.now();

  // Try custom mappers first
  if (config.customMappers) {
    for (const mapper of config.customMappers) {
      const result = mapper(error);
      if (result) {
        return {
          code: result.code ?? generateErrorCode(error),
          userMessage:
            result.userMessage ??
            config.defaultUserMessage ??
            DEFAULT_CONFIG.defaultUserMessage!,
          devMessage:
            result.devMessage ??
            extractDevMessage(error, config.includeStackTrace ?? true),
          severity: result.severity ?? ErrorSeverity.Error,
          category: result.category ?? ErrorCategory.Unknown,
          statusCode: result.statusCode,
          originalError: error,
          timestamp,
          context:
            result.context ??
            config.contextExtractor?.(error) ??
            overrides?.context,
          recoverable: result.recoverable ?? false,
          suggestedAction: result.suggestedAction,
          ...overrides,
        };
      }
    }
  }

  // Handle HttpErrorResponse
  if (error instanceof HttpErrorResponse) {
    const httpMapping = mapHttpError(error, config);
    return {
      code: httpMapping.code ?? generateErrorCode(error, error.status),
      userMessage:
        httpMapping.userMessage ??
        config.defaultUserMessage ??
        DEFAULT_CONFIG.defaultUserMessage!,
      devMessage: extractDevMessage(error, config.includeStackTrace ?? true),
      severity: httpMapping.severity ?? ErrorSeverity.Error,
      category: httpMapping.category ?? ErrorCategory.Server,
      statusCode: httpMapping.statusCode ?? error.status,
      originalError: error,
      timestamp,
      context: config.contextExtractor?.(error) ?? overrides?.context,
      recoverable: httpMapping.recoverable ?? false,
      suggestedAction: httpMapping.suggestedAction,
      ...overrides,
    };
  }

  // Handle network errors (non-HTTP)
  if (isNetworkError(error)) {
    return {
      code: 'NETWORK_ERROR',
      userMessage: 'Unable to connect. Please check your internet connection.',
      devMessage: extractDevMessage(error, config.includeStackTrace ?? true),
      severity: ErrorSeverity.Error,
      category: ErrorCategory.Network,
      originalError: error,
      timestamp,
      context: config.contextExtractor?.(error) ?? overrides?.context,
      recoverable: true,
      suggestedAction: 'Check your connection and try again.',
      ...overrides,
    };
  }

  // Handle standard Error objects
  if (error instanceof Error) {
    return {
      code: generateErrorCode(error),
      userMessage:
        config.defaultUserMessage ?? DEFAULT_CONFIG.defaultUserMessage!,
      devMessage: extractDevMessage(error, config.includeStackTrace ?? true),
      severity: ErrorSeverity.Error,
      category: ErrorCategory.Unknown,
      originalError: error,
      timestamp,
      context: config.contextExtractor?.(error) ?? overrides?.context,
      recoverable: false,
      ...overrides,
    };
  }

  // Handle string errors
  if (typeof error === 'string') {
    return {
      code: 'STRING_ERROR',
      userMessage:
        config.defaultUserMessage ?? DEFAULT_CONFIG.defaultUserMessage!,
      devMessage: error,
      severity: ErrorSeverity.Error,
      category: ErrorCategory.Unknown,
      originalError: error,
      timestamp,
      context: config.contextExtractor?.(error) ?? overrides?.context,
      recoverable: false,
      ...overrides,
    };
  }

  // Handle unknown error types
  return {
    code: 'UNKNOWN_ERROR',
    userMessage:
      config.defaultUserMessage ?? DEFAULT_CONFIG.defaultUserMessage!,
    devMessage: extractDevMessage(error, config.includeStackTrace ?? true),
    severity: ErrorSeverity.Error,
    category: ErrorCategory.Unknown,
    originalError: error,
    timestamp,
    context: config.contextExtractor?.(error) ?? overrides?.context,
    recoverable: false,
    ...overrides,
  };
}

/**
 * Type guard to check if a value is a MappedError.
 *
 * @param value - Value to check
 * @returns True if the value is a MappedError
 *
 * @example
 * ```typescript
 * if (isMappedError(error)) {
 *   console.log(error.userMessage);
 * }
 * ```
 */
export function isMappedError(value: unknown): value is MappedError {
  return (
    typeof value === 'object' &&
    value !== null &&
    'code' in value &&
    'userMessage' in value &&
    'devMessage' in value &&
    'severity' in value &&
    'category' in value &&
    'originalError' in value &&
    'timestamp' in value &&
    'recoverable' in value
  );
}

/**
 * Creates a custom error class that integrates with the error mapper.
 *
 * @param config - Default mapping configuration for this error type
 * @returns A custom Error class
 *
 * @example
 * ```typescript
 * const ValidationError = createMappableError({
 *   code: 'VALIDATION_ERROR',
 *   category: 'validation',
 *   severity: 'warning',
 *   recoverable: true,
 * });
 *
 * throw new ValidationError('Email is invalid', {
 *   userMessage: 'Please enter a valid email address.',
 *   context: { field: 'email' },
 * });
 * ```
 */
export function createMappableError<TContext = unknown>(
  defaultMapping: Partial<MappedError<TContext>>
) {
  return class MappableError extends Error {
    public readonly mapping: Partial<MappedError<TContext>>;

    constructor(
      message: string,
      customMapping?: Partial<MappedError<TContext>>
    ) {
      super(message);
      this.name = 'MappableError';
      this.mapping = { ...defaultMapping, ...customMapping };

      // Maintain proper stack trace
      if (Error.captureStackTrace) {
        Error.captureStackTrace(this, MappableError);
      }
    }
  };
}

/**
 * Utility to extract validation errors from HTTP 400/422 responses.
 *
 * @param error - The error to extract validation errors from
 * @returns Record of field names to error messages, or null if not a validation error
 *
 * @example
 * ```typescript
 * const validationErrors = extractValidationErrors(error);
 * if (validationErrors) {
 *   Object.entries(validationErrors).forEach(([field, message]) => {
 *     form.get(field)?.setErrors({ server: message });
 *   });
 * }
 * ```
 */
export function extractValidationErrors(
  error: unknown
): Record<string, string | string[]> | null {
  if (!(error instanceof HttpErrorResponse)) {
    return null;
  }

  if (error.status !== 400 && error.status !== 422) {
    return null;
  }

  const body = error.error;

  // Handle common API error formats
  if (typeof body === 'object' && body !== null) {
    // Format: { errors: { field: 'message' } }
    if ('errors' in body && typeof body.errors === 'object') {
      return body.errors as Record<string, string | string[]>;
    }

    // Format: { field: 'message' }
    if (!('message' in body) && !('error' in body)) {
      return body as Record<string, string | string[]>;
    }

    // Format: { error: { field: 'message' } }
    if ('error' in body && typeof body.error === 'object') {
      return body.error as Record<string, string | string[]>;
    }
  }

  return null;
}

/**
 * Creates an error mapping function for custom error classes.
 * Use this to register custom error types with the error mapper.
 *
 * @param errorClass - The error class to match
 * @param mapping - The mapping to apply when this error type is encountered
 * @returns An ErrorMappingFn to use with configureErrorMapper
 *
 * @example
 * ```typescript
 * class PaymentDeclinedError extends Error {
 *   constructor(public reason: string) {
 *     super(`Payment declined: ${reason}`);
 *   }
 * }
 *
 * configureErrorMapper({
 *   customMappers: [
 *     createErrorMapping(PaymentDeclinedError, (error) => ({
 *       code: 'PAYMENT_DECLINED',
 *       userMessage: 'Your payment was declined. Please try another method.',
 *       category: 'business',
 *       severity: 'warning',
 *       recoverable: true,
 *       context: { reason: error.reason },
 *     })),
 *   ],
 * });
 * ```
 */
export function createErrorMapping<TError extends Error, TContext = unknown>(
  errorClass: new (...args: never[]) => TError,
  mapping: (error: TError) => Partial<MappedError<TContext>>
): ErrorMappingFn<TContext> {
  return (error: unknown) => {
    if (error instanceof errorClass) {
      return mapping(error);
    }
    return null;
  };
}
