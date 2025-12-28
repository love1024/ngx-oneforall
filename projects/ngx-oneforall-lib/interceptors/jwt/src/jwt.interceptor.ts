import { isPlatformBrowser } from '@angular/common';
import {
  HttpContext,
  HttpErrorResponse,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
  HttpStatusCode,
} from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';
import { JwtService } from '@ngx-oneforall/services/jwt';
import { isRegexp } from '@ngx-oneforall/utils/find-type';
import {
  Observable,
  catchError,
  finalize,
  shareReplay,
  switchMap,
  throwError,
} from 'rxjs';
import { SKIP_JWT_INTERCEPTOR } from './jwt-context';

let refreshToken$: Observable<string> | null = null;

// Exported for testing purposes only
export const resetJwtInterceptor = () => {
  refreshToken$ = null;
};

const httpPorts = ['80', '443'];

const getRequestUrl = (request: HttpRequest<unknown>) => {
  try {
    return new URL(request.url, document.location.origin);
  } catch {
    return null;
  }
};

const isAllowedDomain = (
  request: HttpRequest<unknown>,
  allowedDomains: (string | RegExp)[]
) => {
  const requestUrl = getRequestUrl(request);
  if (!requestUrl) return false;

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
  if (!requestUrl) return false;

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
  if (req.context.get(SKIP_JWT_INTERCEPTOR)) {
    return next(req);
  }

  const platformId = inject(PLATFORM_ID);
  if (!isPlatformBrowser(platformId)) {
    return next(req);
  }

  const jwtService = inject(JwtService);
  const config = jwtService.getConfig() ?? {};

  const {
    authScheme = 'Bearer ',
    headerName = 'Authorization',
    errorOnNoToken = false,
    skipAddingIfExpired = false,
    allowedDomains = [],
    skipUrls = [],
    refreshTokenHandler,
  } = config;

  const token = jwtService.getToken();

  const getAttachedRequest = (request: HttpRequest<unknown>, token: string) => {
    return request.clone({
      setHeaders: {
        [headerName]: `${authScheme}${token}`,
      },
    });
  };

  const handleUnauthorized = (
    failedRequest: HttpRequest<unknown>,
    nextFn: HttpHandlerFn
  ) => {
    if (!refreshToken$) {
      refreshToken$ = refreshTokenHandler!.refreshToken().pipe(
        shareReplay(1),
        finalize(() => {
          refreshToken$ = null;
        })
      );
    }

    return refreshToken$.pipe(
      switchMap(newToken =>
        nextFn(
          getAttachedRequest(
            failedRequest.clone({
              context: new HttpContext().set(SKIP_JWT_INTERCEPTOR, true),
            }),
            newToken
          )
        )
      ),
      catchError(err => {
        refreshTokenHandler!.logout();
        return throwError(() => err);
      })
    );
  };

  if (isDisallowedRoute(req, skipUrls)) {
    return next(req);
  }

  if (allowedDomains.length && !isAllowedDomain(req, allowedDomains)) {
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

  return next(getAttachedRequest(req, token)).pipe(
    catchError(error => {
      if (
        error instanceof HttpErrorResponse &&
        error.status === HttpStatusCode.Unauthorized &&
        refreshTokenHandler
      ) {
        return handleUnauthorized(req, next);
      }
      return throwError(() => error);
    })
  );
};
