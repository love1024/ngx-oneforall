import { HttpInterceptorFn } from '@angular/common/http';
import { BaseUrlContextConfig } from './base-url-context';
import { BASE_URL_CONTEXT } from './base-url-context';
import { isFunction } from '@ngx-oneforall/utils/find-type';

export interface BaseUrlOverrides {
  startWith: string;
  url: string | (() => string);
}

export interface BaseUrlConfig {
  baseUrl: string | (() => string);
  overrides?: BaseUrlOverrides[];
}

const isAbsoluteUrl = (url: string): boolean => /^https?:\/\//i.test(url);

const joinUrl = (base: string, path: string): string =>
  `${base.replace(/\/+$/, '')}/${path.replace(/^\/+/, '')}`;

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
