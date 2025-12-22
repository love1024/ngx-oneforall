import {
  CanActivateFn,
  ActivatedRouteSnapshot,
  Router,
  RedirectCommand,
} from '@angular/router';
import { inject } from '@angular/core';

export interface QueryParamGuardConfig {
  required?: string[];
  redirectTo?: string;
  predicate?: (params: Record<string, string>) => boolean;
}

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
