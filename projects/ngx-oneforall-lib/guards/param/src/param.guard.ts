import {
  CanActivateFn,
  ActivatedRouteSnapshot,
  Router,
  RedirectCommand,
  Params,
} from '@angular/router';
import { inject } from '@angular/core';

/**
 * Configuration options for the paramGuard.
 */
export interface ParamGuardConfig {
  /**
   * Array of parameter names that must be present and non-empty.
   */
  required?: string[];
  /**
   * URL to redirect to if validation fails.
   * If not provided, the navigation is cancelled (returns false).
   */
  redirectTo?: string;
  /**
   * Custom predicate function to validate parameters.
   * Return true if parameters are valid.
   */
  predicate?: (params: Params) => boolean;
}

/**
 * A route guard that validates the presence and value of route parameters.
 *
 * @param config - The configuration object.
 * @returns A CanActivateFn that validates the route parameters.
 *
 * @example
 * // Ensure 'id' is present
 * canActivate: [paramGuard({ required: ['id'], redirectTo: '/404' })]
 *
 * // Custom validation
 * canActivate: [paramGuard({
 *   predicate: params => params['type'] === 'admin',
 *   redirectTo: '/unauthorized'
 * })]
 */
export const paramGuard = (config: ParamGuardConfig): CanActivateFn => {
  const { required = [], redirectTo, predicate } = config;

  return (route: ActivatedRouteSnapshot) => {
    const router = inject(Router);
    const params = route.params;

    for (const key of required) {
      if (
        !Object.prototype.hasOwnProperty.call(params, key) ||
        params[key] == null ||
        params[key] === ''
      ) {
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
