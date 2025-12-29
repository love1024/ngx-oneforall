import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import {
  ENCRYPTION_CONTEXT,
  EncryptionContextConfig,
} from './encryption-context';
import { map } from 'rxjs/operators';

/**
 * Configuration for the encryption interceptor.
 */
export interface EncryptionInterceptorConfig {
  /** Enable/disable encryption globally. Default: true */
  enabled?: boolean;
  /** Header name to indicate encrypted data. Default: 'X-Encrypted-Data' */
  headerName?: string;
  /** Header value when encryption is applied. Default: '1' */
  headerValue?: string;
  /** Throw error if encryption fails. Default: true */
  throwOnEncryptionError?: boolean;
  /** Throw error if decryption fails. Default: true */
  throwOnDecryptionError?: boolean;
  /** Encryption adapter with encrypt/decrypt methods. Required. */
  adapter: EncryptionAdapter;
}

/**
 * Adapter interface for encryption/decryption operations.
 * Implement this interface with your encryption library (e.g., CryptoJS, Web Crypto API).
 *
 * @typeParam T - Type of unencrypted data
 * @typeParam E - Type of encrypted data
 *
 * @example
 * ```typescript
 * const aesAdapter: EncryptionAdapter<object, string> = {
 *   encrypt: (data) => CryptoJS.AES.encrypt(JSON.stringify(data), SECRET).toString(),
 *   decrypt: (data) => JSON.parse(CryptoJS.AES.decrypt(data, SECRET).toString(CryptoJS.enc.Utf8))
 * };
 * ```
 */
export interface EncryptionAdapter<T = unknown, E = unknown> {
  encrypt(data: T): E;
  decrypt(data: E): T;
}

/**
 * Creates an HTTP interceptor that encrypts request bodies and decrypts response bodies.
 *
 * @param config - Encryption configuration with adapter
 * @returns An Angular HTTP interceptor function
 *
 * @example
 * ```typescript
 * provideHttpClient(
 *   withInterceptors([
 *     withEncryptionInterceptor({
 *       adapter: {
 *         encrypt: (data) => btoa(JSON.stringify(data)),
 *         decrypt: (data) => JSON.parse(atob(data))
 *       },
 *       throwOnEncryptionError: true,  // Fail request if encryption fails
 *       throwOnDecryptionError: false  // Return raw response if decryption fails
 *     })
 *   ])
 * );
 * ```
 *
 * @remarks
 * - Request bodies are encrypted before sending
 * - Response bodies are decrypted after receiving
 * - Per-request control via `ENCRYPTION_CONTEXT`
 * - Adds header to indicate encrypted content
 */
export const withEncryptionInterceptor = (
  config: EncryptionInterceptorConfig
) => {
  const {
    enabled = true,
    headerName = 'X-Encrypted-Data',
    headerValue = '1',
    throwOnEncryptionError = true,
    throwOnDecryptionError = true,
    adapter,
  } = config;

  if (!adapter) {
    throw new Error(
      '[NgxOneforall - EncryptionInterceptor]: Encryption adapter is required'
    );
  }

  const encryptionInterceptor: HttpInterceptorFn = (request, next) => {
    const contextConfig: EncryptionContextConfig | null =
      request.context.get(ENCRYPTION_CONTEXT);

    if (contextConfig?.enabled === false || !enabled) {
      return next(request);
    }

    let encryptedRequest = request;
    const encryptRequest = contextConfig?.encryptRequest ?? true;
    const decryptResponse = contextConfig?.decryptResponse ?? true;

    if (encryptRequest && request.body != null) {
      try {
        encryptedRequest = request.clone({
          body: adapter.encrypt(request.body),
          setHeaders: {
            [headerName]: headerValue,
          },
        });
      } catch (error) {
        if (throwOnEncryptionError) {
          throw error;
        }
        // Silently continue with unencrypted request
      }
    }

    return next(encryptedRequest).pipe(
      map(event => {
        if (
          decryptResponse &&
          event instanceof HttpResponse &&
          event.body != null
        ) {
          try {
            return event.clone({
              body: adapter.decrypt(event.body),
            });
          } catch (error) {
            if (throwOnDecryptionError) {
              throw error;
            }
            // Silently return raw response
          }
        }
        return event;
      })
    );
  };

  return encryptionInterceptor;
};
