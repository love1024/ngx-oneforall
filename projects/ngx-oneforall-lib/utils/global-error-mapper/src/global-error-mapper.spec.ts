import { HttpErrorResponse } from '@angular/common/http';
import {
  mapError,
  configureErrorMapper,
  resetErrorMapperConfig,
  getErrorMapperConfig,
  isMappedError,
  createMappableError,
  extractValidationErrors,
  createErrorMapping,
  ErrorSeverity,
  ErrorCategory,
  MappedError,
} from './global-error-mapper';

describe('GlobalErrorMapper', () => {
  beforeEach(() => {
    resetErrorMapperConfig();
  });

  describe('mapError', () => {
    describe('with HttpErrorResponse', () => {
      it('should map 400 Bad Request', () => {
        const error = new HttpErrorResponse({
          status: 400,
          statusText: 'Bad Request',
          error: { message: 'Invalid input' },
        });

        const mapped = mapError(error);

        expect(mapped.code).toBe('HTTP_400');
        expect(mapped.userMessage).toBe(
          'The request could not be processed. Please check your input.'
        );
        expect(mapped.severity).toBe(ErrorSeverity.Warning);
        expect(mapped.category).toBe(ErrorCategory.Validation);
        expect(mapped.statusCode).toBe(400);
        expect(mapped.recoverable).toBe(true);
        expect(mapped.originalError).toBe(error);
        expect(mapped.timestamp).toBeDefined();
      });

      it('should map 401 Unauthorized', () => {
        const error = new HttpErrorResponse({
          status: 401,
          statusText: 'Unauthorized',
        });

        const mapped = mapError(error);

        expect(mapped.code).toBe('HTTP_401');
        expect(mapped.userMessage).toBe('Please log in to continue.');
        expect(mapped.severity).toBe(ErrorSeverity.Warning);
        expect(mapped.category).toBe(ErrorCategory.Auth);
        expect(mapped.recoverable).toBe(true);
      });

      it('should map 403 Forbidden', () => {
        const error = new HttpErrorResponse({
          status: 403,
          statusText: 'Forbidden',
        });

        const mapped = mapError(error);

        expect(mapped.code).toBe('HTTP_403');
        expect(mapped.userMessage).toBe(
          'You do not have permission to perform this action.'
        );
        expect(mapped.category).toBe(ErrorCategory.Auth);
        expect(mapped.recoverable).toBe(false);
      });

      it('should map 404 Not Found', () => {
        const error = new HttpErrorResponse({
          status: 404,
          statusText: 'Not Found',
        });

        const mapped = mapError(error);

        expect(mapped.code).toBe('HTTP_404');
        expect(mapped.userMessage).toBe(
          'The requested resource was not found.'
        );
        expect(mapped.category).toBe(ErrorCategory.Client);
      });

      it('should map 500 Internal Server Error', () => {
        const error = new HttpErrorResponse({
          status: 500,
          statusText: 'Internal Server Error',
        });

        const mapped = mapError(error);

        expect(mapped.code).toBe('HTTP_500');
        expect(mapped.userMessage).toBe(
          'An unexpected error occurred. Please try again later.'
        );
        expect(mapped.severity).toBe(ErrorSeverity.Error);
        expect(mapped.category).toBe(ErrorCategory.Server);
        expect(mapped.recoverable).toBe(true);
      });

      it('should map 502 Bad Gateway', () => {
        const error = new HttpErrorResponse({
          status: 502,
          statusText: 'Bad Gateway',
        });

        const mapped = mapError(error);

        expect(mapped.code).toBe('HTTP_502');
        expect(mapped.severity).toBe(ErrorSeverity.Error);
        expect(mapped.category).toBe(ErrorCategory.Server);
      });

      it('should map 503 Service Unavailable', () => {
        const error = new HttpErrorResponse({
          status: 503,
          statusText: 'Service Unavailable',
        });

        const mapped = mapError(error);

        expect(mapped.code).toBe('HTTP_503');
        expect(mapped.userMessage).toBe(
          'The service is temporarily unavailable. Please try again later.'
        );
      });

      it('should map network errors (status 0)', () => {
        const error = new HttpErrorResponse({
          status: 0,
          statusText: 'Unknown Error',
          error: new ProgressEvent('error'),
        });

        const mapped = mapError(error);

        expect(mapped.code).toBe('NETWORK_ERROR');
        expect(mapped.userMessage).toBe(
          'Unable to connect. Please check your internet connection.'
        );
        expect(mapped.category).toBe(ErrorCategory.Network);
        expect(mapped.recoverable).toBe(true);
      });

      it('should handle unmapped 4xx status codes', () => {
        const error = new HttpErrorResponse({
          status: 418,
          statusText: "I'm a teapot",
        });

        const mapped = mapError(error);

        expect(mapped.code).toBe('HTTP_418');
        expect(mapped.category).toBe(ErrorCategory.Client);
        expect(mapped.recoverable).toBe(true);
      });

      it('should handle unmapped 5xx status codes', () => {
        const error = new HttpErrorResponse({
          status: 599,
          statusText: 'Unknown Server Error',
        });

        const mapped = mapError(error);

        expect(mapped.code).toBe('HTTP_599');
        expect(mapped.category).toBe(ErrorCategory.Server);
      });

      it('should include error body in devMessage', () => {
        const error = new HttpErrorResponse({
          status: 400,
          statusText: 'Bad Request',
          error: { field: 'email', message: 'Invalid format' },
        });

        const mapped = mapError(error);

        expect(mapped.devMessage).toContain('email');
        expect(mapped.devMessage).toContain('Invalid format');
      });
    });

    describe('with standard Error objects', () => {
      it('should map TypeError', () => {
        const error = new TypeError('Cannot read property of undefined');

        const mapped = mapError(error);

        expect(mapped.code).toBe('TYPE_ERROR');
        expect(mapped.devMessage).toContain('TypeError');
        expect(mapped.devMessage).toContain(
          'Cannot read property of undefined'
        );
        expect(mapped.category).toBe(ErrorCategory.Unknown);
      });

      it('should map ReferenceError', () => {
        const error = new ReferenceError('x is not defined');

        const mapped = mapError(error);

        expect(mapped.code).toBe('REFERENCE_ERROR');
        expect(mapped.devMessage).toContain('ReferenceError');
      });

      it('should map SyntaxError', () => {
        const error = new SyntaxError('Unexpected token');

        const mapped = mapError(error);

        expect(mapped.code).toBe('SYNTAX_ERROR');
      });

      it('should map RangeError', () => {
        const error = new RangeError('Invalid array length');

        const mapped = mapError(error);

        expect(mapped.code).toBe('RANGE_ERROR');
      });

      it('should map generic Error', () => {
        const error = new Error('Something went wrong');

        const mapped = mapError(error);

        expect(mapped.code).toBe('ERROR_ERROR');
        expect(mapped.devMessage).toContain('Something went wrong');
      });

      it('should include stack trace in devMessage by default', () => {
        const error = new Error('Test error');

        const mapped = mapError(error);

        expect(mapped.devMessage).toContain('Stack:');
      });
    });

    describe('with string errors', () => {
      it('should map string error', () => {
        const error = 'Something failed';

        const mapped = mapError(error);

        expect(mapped.code).toBe('STRING_ERROR');
        expect(mapped.devMessage).toBe('Something failed');
        expect(mapped.category).toBe(ErrorCategory.Unknown);
      });
    });

    describe('with unknown error types', () => {
      it('should map null', () => {
        const mapped = mapError(null);

        expect(mapped.code).toBe('UNKNOWN_ERROR');
        expect(mapped.originalError).toBeNull();
      });

      it('should map undefined', () => {
        const mapped = mapError(undefined);

        expect(mapped.code).toBe('UNKNOWN_ERROR');
        expect(mapped.originalError).toBeUndefined();
      });

      it('should map plain object', () => {
        const error = { custom: 'error', code: 123 };

        const mapped = mapError(error);

        expect(mapped.code).toBe('UNKNOWN_ERROR');
        expect(mapped.devMessage).toContain('custom');
        expect(mapped.originalError).toBe(error);
      });

      it('should map number', () => {
        const mapped = mapError(42);

        expect(mapped.code).toBe('UNKNOWN_ERROR');
        expect(mapped.devMessage).toBe('42');
      });
    });

    describe('with overrides', () => {
      it('should apply partial overrides', () => {
        const error = new Error('Test');

        const mapped = mapError(error, {
          userMessage: 'Custom user message',
          suggestedAction: 'Try again',
        });

        expect(mapped.userMessage).toBe('Custom user message');
        expect(mapped.suggestedAction).toBe('Try again');
      });

      it('should allow adding context', () => {
        const error = new Error('Test');

        const mapped = mapError(error, {
          context: { userId: 123, action: 'save' },
        });

        expect(mapped.context).toEqual({ userId: 123, action: 'save' });
      });
    });
  });

  describe('configureErrorMapper', () => {
    it('should allow custom HTTP mappings', () => {
      configureErrorMapper({
        httpMappings: {
          418: {
            userMessage: "I'm a teapot!",
            severity: ErrorSeverity.Info,
            category: ErrorCategory.Business,
            recoverable: false,
          },
        },
      });

      const error = new HttpErrorResponse({
        status: 418,
        statusText: "I'm a teapot",
      });

      const mapped = mapError(error);

      expect(mapped.userMessage).toBe("I'm a teapot!");
      expect(mapped.severity).toBe(ErrorSeverity.Info);
      expect(mapped.category).toBe(ErrorCategory.Business);
    });

    it('should allow custom default user message', () => {
      configureErrorMapper({
        defaultUserMessage: 'Oops! Something went wrong.',
      });

      const error = new Error('Unknown error');
      const mapped = mapError(error);

      expect(mapped.userMessage).toBe('Oops! Something went wrong.');
    });

    it('should support custom mappers', () => {
      class CustomBusinessError extends Error {
        constructor(
          message: string,
          public errorCode: string
        ) {
          super(message);
        }
      }

      configureErrorMapper({
        customMappers: [
          error => {
            if (error instanceof CustomBusinessError) {
              return {
                code: error.errorCode,
                userMessage: 'Business error occurred',
                category: ErrorCategory.Business,
                severity: ErrorSeverity.Warning,
                recoverable: true,
              };
            }
            return null;
          },
        ],
      });

      const error = new CustomBusinessError('Order failed', 'ORDER_FAILED');
      const mapped = mapError(error);

      expect(mapped.code).toBe('ORDER_FAILED');
      expect(mapped.userMessage).toBe('Business error occurred');
      expect(mapped.category).toBe(ErrorCategory.Business);
    });

    it('should process custom mappers in order', () => {
      configureErrorMapper({
        customMappers: [
          () => ({ code: 'FIRST_MAPPER' }),
          () => ({ code: 'SECOND_MAPPER' }),
        ],
      });

      const error = new Error('Test');
      const mapped = mapError(error);

      expect(mapped.code).toBe('FIRST_MAPPER');
    });

    it('should support context extractor', () => {
      interface ErrorWithContext extends Error {
        userId?: number;
      }

      configureErrorMapper<{ userId?: number }>({
        contextExtractor: error => {
          if (error instanceof Error && 'userId' in error) {
            return { userId: (error as ErrorWithContext).userId };
          }
          return undefined;
        },
      });

      const error = new Error('Test') as ErrorWithContext;
      error.userId = 123;

      const mapped = mapError(error);

      expect(mapped.context).toEqual({ userId: 123 });
    });

    it('should disable stack trace when configured', () => {
      configureErrorMapper({
        includeStackTrace: false,
      });

      const error = new Error('Test error');
      const mapped = mapError(error);

      expect(mapped.devMessage).not.toContain('Stack:');
    });
  });

  describe('resetErrorMapperConfig', () => {
    it('should reset to default configuration', () => {
      configureErrorMapper({
        defaultUserMessage: 'Custom message',
      });

      resetErrorMapperConfig();

      const error = new Error('Test');
      const mapped = mapError(error);

      expect(mapped.userMessage).toBe(
        'An unexpected error occurred. Please try again.'
      );
    });
  });

  describe('getErrorMapperConfig', () => {
    it('should return current configuration', () => {
      configureErrorMapper({
        defaultUserMessage: 'Custom message',
        includeStackTrace: false,
      });

      const config = getErrorMapperConfig();

      expect(config.defaultUserMessage).toBe('Custom message');
      expect(config.includeStackTrace).toBe(false);
    });

    it('should return a copy (not modify original)', () => {
      const config = getErrorMapperConfig();
      config.defaultUserMessage = 'Modified';

      const newConfig = getErrorMapperConfig();
      expect(newConfig.defaultUserMessage).not.toBe('Modified');
    });
  });

  describe('isMappedError', () => {
    it('should return true for valid MappedError', () => {
      const error = new Error('Test');
      const mapped = mapError(error);

      expect(isMappedError(mapped)).toBe(true);
    });

    it('should return false for regular Error', () => {
      const error = new Error('Test');

      expect(isMappedError(error)).toBe(false);
    });

    it('should return false for partial objects', () => {
      expect(isMappedError({ code: 'TEST' })).toBe(false);
      expect(
        isMappedError({
          code: 'TEST',
          userMessage: 'Test',
        })
      ).toBe(false);
    });

    it('should return false for null/undefined', () => {
      expect(isMappedError(null)).toBe(false);
      expect(isMappedError(undefined)).toBe(false);
    });

    it('should return false for primitive values', () => {
      expect(isMappedError('error')).toBe(false);
      expect(isMappedError(123)).toBe(false);
    });
  });

  describe('createMappableError', () => {
    it('should create a custom error class', () => {
      const ValidationError = createMappableError({
        code: 'VALIDATION_ERROR',
        category: ErrorCategory.Validation,
        severity: ErrorSeverity.Warning,
        recoverable: true,
      });

      const error = new ValidationError('Invalid email');

      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe('Invalid email');
      expect(error.mapping.code).toBe('VALIDATION_ERROR');
    });

    it('should allow instance-level customization', () => {
      const BusinessError = createMappableError({
        code: 'BUSINESS_ERROR',
        category: ErrorCategory.Business,
      });

      const error = new BusinessError('Order failed', {
        userMessage: 'Your order could not be processed.',
        suggestedAction: 'Please try again.',
      });

      expect(error.mapping.userMessage).toBe(
        'Your order could not be processed.'
      );
      expect(error.mapping.suggestedAction).toBe('Please try again.');
    });

    it('should work with custom mappers', () => {
      const PaymentError = createMappableError({
        code: 'PAYMENT_ERROR',
        userMessage: 'Payment failed',
        category: ErrorCategory.Business,
        severity: ErrorSeverity.Warning,
      });

      configureErrorMapper({
        customMappers: [
          error => {
            if (
              error instanceof Error &&
              'mapping' in error &&
              typeof error.mapping === 'object'
            ) {
              return error.mapping as Partial<MappedError>;
            }
            return null;
          },
        ],
      });

      const error = new PaymentError('Card declined');
      const mapped = mapError(error);

      expect(mapped.code).toBe('PAYMENT_ERROR');
      expect(mapped.userMessage).toBe('Payment failed');
    });
  });

  describe('extractValidationErrors', () => {
    it('should extract errors from 400 response with errors object', () => {
      const error = new HttpErrorResponse({
        status: 400,
        error: {
          errors: {
            email: 'Invalid email format',
            password: 'Password too short',
          },
        },
      });

      const validationErrors = extractValidationErrors(error);

      expect(validationErrors).toEqual({
        email: 'Invalid email format',
        password: 'Password too short',
      });
    });

    it('should extract errors from 422 response', () => {
      const error = new HttpErrorResponse({
        status: 422,
        error: {
          errors: {
            name: ['Name is required', 'Name must be at least 2 characters'],
          },
        },
      });

      const validationErrors = extractValidationErrors(error);

      expect(validationErrors).toEqual({
        name: ['Name is required', 'Name must be at least 2 characters'],
      });
    });

    it('should extract flat field errors', () => {
      const error = new HttpErrorResponse({
        status: 400,
        error: {
          username: 'Username already taken',
          email: 'Email is invalid',
        },
      });

      const validationErrors = extractValidationErrors(error);

      expect(validationErrors).toEqual({
        username: 'Username already taken',
        email: 'Email is invalid',
      });
    });

    it('should return null for non-validation status codes', () => {
      const error = new HttpErrorResponse({
        status: 500,
        error: { message: 'Server error' },
      });

      expect(extractValidationErrors(error)).toBeNull();
    });

    it('should return null for non-HttpErrorResponse', () => {
      expect(extractValidationErrors(new Error('Test'))).toBeNull();
      expect(extractValidationErrors('error')).toBeNull();
      expect(extractValidationErrors(null)).toBeNull();
    });

    it('should handle error property format', () => {
      const error = new HttpErrorResponse({
        status: 400,
        error: {
          error: {
            field1: 'Error 1',
          },
        },
      });

      const validationErrors = extractValidationErrors(error);

      expect(validationErrors).toEqual({
        field1: 'Error 1',
      });
    });
  });

  describe('createErrorMapping', () => {
    class NetworkTimeoutError extends Error {
      constructor(public url: string) {
        super(`Request to ${url} timed out`);
      }
    }

    it('should create a mapper function for specific error class', () => {
      const mapper = createErrorMapping(NetworkTimeoutError, error => ({
        code: 'NETWORK_TIMEOUT',
        userMessage: 'The request took too long.',
        category: ErrorCategory.Network,
        context: { url: error.url },
      }));

      const error = new NetworkTimeoutError('https://api.example.com');
      const result = mapper(error);

      expect(result).not.toBeNull();
      expect(result?.code).toBe('NETWORK_TIMEOUT');
      expect(result?.context).toEqual({ url: 'https://api.example.com' });
    });

    it('should return null for non-matching errors', () => {
      const mapper = createErrorMapping(NetworkTimeoutError, () => ({
        code: 'NETWORK_TIMEOUT',
      }));

      const error = new Error('Generic error');
      const result = mapper(error);

      expect(result).toBeNull();
    });

    it('should work with configureErrorMapper', () => {
      configureErrorMapper({
        customMappers: [
          createErrorMapping(NetworkTimeoutError, error => ({
            code: 'TIMEOUT',
            userMessage: 'Request timed out.',
            category: ErrorCategory.Network,
            severity: ErrorSeverity.Warning,
            recoverable: true,
            context: { url: error.url },
          })),
        ],
      });

      const error = new NetworkTimeoutError('https://api.test.com');
      const mapped = mapError(error);

      expect(mapped.code).toBe('TIMEOUT');
      expect(mapped.userMessage).toBe('Request timed out.');
      expect(mapped.context).toEqual({ url: 'https://api.test.com' });
    });
  });

  describe('ErrorSeverity constants', () => {
    it('should have expected values', () => {
      expect(ErrorSeverity.Info).toBe('info');
      expect(ErrorSeverity.Warning).toBe('warning');
      expect(ErrorSeverity.Error).toBe('error');
      expect(ErrorSeverity.Critical).toBe('critical');
    });
  });

  describe('ErrorCategory constants', () => {
    it('should have expected values', () => {
      expect(ErrorCategory.Network).toBe('network');
      expect(ErrorCategory.Auth).toBe('auth');
      expect(ErrorCategory.Validation).toBe('validation');
      expect(ErrorCategory.Business).toBe('business');
      expect(ErrorCategory.Server).toBe('server');
      expect(ErrorCategory.Client).toBe('client');
      expect(ErrorCategory.Unknown).toBe('unknown');
    });
  });

  describe('MappedError timestamp', () => {
    it('should include current timestamp', () => {
      const before = Date.now();
      const mapped = mapError(new Error('Test'));
      const after = Date.now();

      expect(mapped.timestamp).toBeGreaterThanOrEqual(before);
      expect(mapped.timestamp).toBeLessThanOrEqual(after);
    });
  });
});
