import {
  CanActivateFn,
  ActivatedRouteSnapshot,
  Router,
  RedirectCommand,
  Params,
} from '@angular/router';
import { inject } from '@angular/core';

/**
 * Configuration options for the queryParamGuard.
 */
export interface QueryParamGuardConfig {
  /**
   * Array of query parameter names that must be present and non-empty.
   */
  required?: string[];
  /**
   * URL to redirect to if validation fails.
   * If not provided, the navigation is cancelled (returns false).
   */
  redirectTo?: string;
  /**
   * Custom predicate function to validate query parameters.
   * Return true if parameters are valid.
   */
  predicate?: (params: Params) => boolean;
}

/**
 * A route guard that validates the presence and value of query parameters.
 *
 * @param config - The configuration object.
 * @returns A CanActivateFn that validates the query parameters.
 *
 * @example
 * // Ensure 'token' query param is present
 * canActivate: [queryParamGuard({ required: ['token'], redirectTo: '/login' })]
 *
 * // Custom validation
 * canActivate: [queryParamGuard({
 *   predicate: params => params['mode'] === 'advanced',
 *   redirectTo: '/basic'
 * })]
 */
export const queryParamGuard = (
  config: QueryParamGuardConfig
): CanActivateFn => {
  const { required = [], redirectTo, predicate } = config;

  return (route: ActivatedRouteSnapshot) => {
    const router = inject(Router);
    const params = route.queryParams ?? {};

    for (const key of required) {
      if (!(key in params) || params[key] == null || params[key] === '') {
        return redirectTo
          ? new RedirectCommand(router.parseUrl(redirectTo))
          : false;
      }
    }

    if (predicate && !predicate(params)) {
      return redirectTo
        ? new RedirectCommand(router.parseUrl(redirectTo))
        : false;
    }

    return true;
  };
};
