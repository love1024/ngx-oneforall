import { HttpInterceptorFn } from '@angular/common/http';
import { BaseUrlContextConfig } from './base-url-context';
import { BASE_URL_CONTEXT } from './base-url-context';

const isAbsoluteUrl = (url: string): boolean => /^https?:\/\//i.test(url);

const joinUrl = (base: string, path: string): string =>
  `${base.replace(/\/+$/, '')}/${path.replace(/^\/+/, '')}`;

export const withBaseUrlInterceptor = (config: BaseUrlContextConfig) => {
  const { baseUrl } = config;

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

    const resolvedBaseUrl = contextConfig?.baseUrl ?? baseUrl;

    // If request URL is already absolute, do not prepend base URL
    if (isAbsoluteUrl(request.url)) {
      return next(request);
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
