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
import { isRegexp } from 'ngx-oneforall/utils/find-type';
import {
  Observable,
  catchError,
  finalize,
  shareReplay,
  switchMap,
  throwError,
} from 'rxjs';
import { SKIP_JWT_INTERCEPTOR } from './jwt-context';
import { JwtService } from 'ngx-oneforall/services/jwt';

let refreshToken$: Observable<string> | null = null;

/** Exported for testing purposes only */
export const resetJwtInterceptor = () => {
  refreshToken$ = null;
};

/**
 * Handler for automatic token refresh on 401 errors.
 */
export interface RefreshTokenHandler {
  /** Returns Observable with new token */
  refreshToken(): Observable<string>;
  /** Called when refresh fails */
  logout(): void;
}

/**
 * Configuration for the JWT interceptor.
 */
export interface JwtInterceptorConfig {
  /** Function that returns the current JWT token. Required. */
  tokenGetter: () => string | null;
  /** Authorization scheme prefix. Default: 'Bearer ' */
  authScheme?: string;
  /** Header name for the token. Default: 'Authorization' */
  headerName?: string;
  /** Domains allowed to receive the token. Empty = all allowed. */
  allowedDomains?: (string | RegExp)[];
  /** URLs to skip token attachment. */
  skipUrls?: (string | RegExp)[];
  /** Skip adding token if expired. Default: false */
  skipAddingIfExpired?: boolean;
  /** Throw error if no token available. Default: false */
  errorOnNoToken?: boolean;
  /** Handler for automatic token refresh on 401 errors. */
  refreshTokenHandler?: RefreshTokenHandler;
}

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
      return (
        parsedRoute.hostname === requestUrl.hostname &&
        requestUrl.pathname.startsWith(parsedRoute.pathname)
      );
    }
  });
};

/**
 * Creates an HTTP interceptor that attaches JWT tokens to outgoing requests.
 *
 * @param config - JWT interceptor configuration
 * @returns An Angular HTTP interceptor function
 *
 * @example
 * ```typescript
 * provideHttpClient(
 *   withInterceptors([
 *     withJwtInterceptor({
 *       tokenGetter: () => localStorage.getItem('token'),
 *       allowedDomains: ['api.example.com'],
 *       refreshTokenHandler: {
 *         refreshToken: () => authService.refresh(),
 *         logout: () => authService.logout()
 *       }
 *     })
 *   ])
 * );
 * ```
 *
 * @remarks
 * - Automatically attaches token to requests for allowed domains
 * - Handles 401 errors with automatic token refresh (if handler provided)
 * - SSR-safe (skips on server)
 * - Per-request skip via `SKIP_JWT_INTERCEPTOR` context
 */
export const withJwtInterceptor = (config: JwtInterceptorConfig) => {
  const {
    tokenGetter,
    authScheme = 'Bearer ',
    headerName = 'Authorization',
    allowedDomains = [],
    skipUrls = [],
    skipAddingIfExpired = false,
    errorOnNoToken = false,
    refreshTokenHandler,
  } = config;

  if (!tokenGetter) {
    throw new Error('[NgxOneforall - JwtInterceptor]: tokenGetter is required');
  }

  // Create internal JwtService for token validation
  const jwtService = new JwtService({ tokenGetter });

  const jwtInterceptor: HttpInterceptorFn = (req, next) => {
    if (req.context.get(SKIP_JWT_INTERCEPTOR)) {
      return next(req);
    }

    const platformId = inject(PLATFORM_ID);
    if (!isPlatformBrowser(platformId)) {
      return next(req);
    }

    const token = tokenGetter();

    const getAttachedRequest = (request: HttpRequest<unknown>, tkn: string) => {
      return request.clone({
        setHeaders: {
          [headerName]: `${authScheme}${tkn}`,
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
          '[NgxOneforall - JwtInterceptor]: tokenGetter returned no token'
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

  return jwtInterceptor;
};
