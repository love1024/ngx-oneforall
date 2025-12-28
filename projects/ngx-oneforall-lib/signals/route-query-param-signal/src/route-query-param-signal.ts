import { inject, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { map } from 'rxjs';

/**
 * Creates a signal that tracks a specific query parameter.
 * Reactively updates when the query parameter changes.
 *
 * @param paramName - Name of the query parameter to track
 * @returns A signal containing the parameter value or null
 *
 * @example
 * ```typescript
 * // For URL: /search?q=angular
 * const query = routeQueryParamSignal('q');
 * ```
 */
export function routeQueryParamSignal(
  paramName: string
): Signal<string | null> {
  const route = inject(ActivatedRoute);

  return toSignal(route.queryParamMap.pipe(map(pm => pm.get(paramName))), {
    initialValue: route.snapshot.queryParamMap.get(paramName),
  });
}

/**
 * Creates a signal that tracks the entire query parameter map.
 * Useful when you need access to multiple query parameters.
 *
 * @returns A signal containing the full query ParamMap
 *
 * @example
 * ```typescript
 * const params = routeQueryParamsMapSignal();
 * const sort = params().get('sort');
 * ```
 */
export function routeQueryParamsMapSignal(): Signal<ParamMap> {
  const route = inject(ActivatedRoute);

  return toSignal(route.queryParamMap, {
    initialValue: route.snapshot.queryParamMap,
  });
}
