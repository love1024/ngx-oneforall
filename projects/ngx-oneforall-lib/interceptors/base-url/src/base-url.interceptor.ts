import { HttpInterceptorFn } from '@angular/common/http';
import { BaseUrlContextConfig, BASE_URL_CONTEXT } from './base-url-context';
import { isFunction } from '@ngx-oneforall/utils/find-type';

/**
 * Configuration for URL-specific base URL overrides.
 * Allows different base URLs for requests matching specific path prefixes.
 */
export interface BaseUrlOverrides {
  /** The path prefix to match against (e.g., 'api/v2', 'auth') */
  startWith: string;
  /** The base URL to use for matching requests. Can be a static string or a function returning a string. */
  url: string | (() => string);
}

/**
 * Configuration for the base URL interceptor.
 */
export interface BaseUrlConfig {
  /** The default base URL to prepend to relative request URLs. Can be a static string or a function returning a string. */
  baseUrl: string | (() => string);
  /** Optional array of overrides for specific URL path prefixes. */
  overrides?: BaseUrlOverrides[];
}

/**
 * Checks if a URL is absolute (starts with http:// or https://).
 */
const isAbsoluteUrl = (url: string): boolean => /^https?:\/\//i.test(url);

/**
 * Joins a base URL with a path, handling trailing/leading slashes.
 */
const joinUrl = (base: string, path: string): string =>
  `${base.replace(/\/+$/, '')}/${path.replace(/^\/+/, '')}`;

/**
 * Creates an HTTP interceptor that prepends a base URL to relative request URLs.
 *
 * @param config - The base URL configuration
 * @returns An Angular HTTP interceptor function
 *
 * @example
 * ```typescript
 * // Basic usage with static base URL
 * provideHttpClient(
 *   withInterceptors([
 *     withBaseUrlInterceptor({ baseUrl: 'https://api.example.com' })
 *   ])
 * );
 *
 * // With dynamic base URL
 * withBaseUrlInterceptor({
 *   baseUrl: () => environment.apiUrl
 * });
 *
 * // With path-specific overrides
 * withBaseUrlInterceptor({
 *   baseUrl: 'https://api.example.com',
 *   overrides: [
 *     { startWith: 'auth', url: 'https://auth.example.com' },
 *     { startWith: 'api/v2', url: 'https://api-v2.example.com' }
 *   ]
 * });
 * ```
 *
 * @remarks
 * - Absolute URLs (starting with http:// or https://) are passed through unchanged.
 * - Per-request behavior can be controlled via `BASE_URL_CONTEXT`.
 * - Overrides are matched in array order; first match wins.
 */
export const withBaseUrlInterceptor = (config: BaseUrlConfig) => {
  const { baseUrl, overrides } = config;

  if (!baseUrl) {
    throw new Error('[BaseUrlInterceptor] baseUrl must be provided');
  }

  const baseUrlInterceptor: HttpInterceptorFn = (request, next) => {
    const contextConfig: BaseUrlContextConfig | null =
      request.context.get(BASE_URL_CONTEXT);

    // Disabled via context
    if (contextConfig?.enabled === false) {
      return next(request);
    }

    // If request URL is already absolute, do not prepend base URL
    if (isAbsoluteUrl(request.url)) {
      return next(request);
    }

    let resolvedBaseUrl = contextConfig?.baseUrl ?? baseUrl;
    let requestUrl = request.url;

    if (overrides) {
      if (requestUrl.startsWith('/')) {
        requestUrl = requestUrl.substring(1);
      }
      const override = overrides.find(o => requestUrl.startsWith(o.startWith));
      if (override) {
        resolvedBaseUrl = override.url;
      }
    }

    if (isFunction(resolvedBaseUrl)) {
      resolvedBaseUrl = resolvedBaseUrl();
    }

    const fullUrl = joinUrl(resolvedBaseUrl, request.url);

    return next(
      request.clone({
        url: fullUrl,
      })
    );
  };

  return baseUrlInterceptor;
};
