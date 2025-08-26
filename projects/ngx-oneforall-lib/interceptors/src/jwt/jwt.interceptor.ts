import { HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { JwtService } from '@ngx-oneforall/services';
import { isRegexp } from '@ngx-oneforall/utils';

const httpPorts = ['80', '443'];

const getRequestUrl = (request: HttpRequest<unknown>) => {
  return new URL(request.url, document.location.origin);
};

const isAllowedDomain = (
  request: HttpRequest<unknown>,
  allowedDomains: (string | RegExp)[]
) => {
  const requestUrl = getRequestUrl(request);

  if (requestUrl.origin === document.location.origin) {
    return true;
  }

  // If not the current domain, check the allowed list
  const hostName = `${requestUrl.hostname}${
    requestUrl.port && !httpPorts.includes(requestUrl.port)
      ? ':' + requestUrl.port
      : ''
  }`;

  return allowedDomains.some(domain =>
    isRegexp(domain) ? (domain as RegExp).test(hostName) : domain === hostName
  );
};

const isDisallowedRoute = (
  request: HttpRequest<unknown>,
  excludedRoutes: (string | RegExp)[]
) => {
  const requestUrl = getRequestUrl(request);

  return excludedRoutes.some(route => {
    if (isRegexp(route)) {
      return (route as RegExp).test(request.url);
    } else {
      const parsedRoute = new URL(route as string, document.location.origin);

      // Require same host, allow prefix match on path
      return (
        parsedRoute.hostname === requestUrl.hostname &&
        requestUrl.pathname.startsWith(parsedRoute.pathname)
      );
    }
  });
};

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const jwtService = inject(JwtService);
  const config = jwtService.getConfig() ?? {};

  const {
    authScheme = 'Bearer ',
    headerName = 'Authorization',
    errorOnNoToken = false,
    skipAddingIfExpired = false,
    includedDomains = [],
    excludedRoutes = [],
  } = config;

  const token = jwtService.getToken();

  if (isDisallowedRoute(req, excludedRoutes)) {
    return next(req);
  }

  if (includedDomains.length && !isAllowedDomain(req, includedDomains)) {
    return next(req);
  }

  if (!token) {
    if (errorOnNoToken) {
      throw new Error(
        '[NgxOneforall - JWT Interceptor]: Token getter returned no token'
      );
    }
    return next(req);
  }

  const isExpired = jwtService.isExpired(token);
  if (isExpired && skipAddingIfExpired) {
    return next(req);
  }

  return next(
    req.clone({
      setHeaders: {
        [headerName]: `${authScheme}${token}`,
      },
    })
  );
};
