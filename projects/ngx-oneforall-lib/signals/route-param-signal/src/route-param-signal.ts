import { inject, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { map } from 'rxjs';

/**
 * Creates a signal that tracks a specific route parameter.
 * Reactively updates when the parameter changes.
 *
 * @param paramName - Name of the route parameter to track
 * @returns A signal containing the parameter value or null
 *
 * @example
 * ```typescript
 * // For route: /users/:id
 * const userId = routeParamSignal('id');
 * ```
 */
export function routeParamSignal(paramName: string): Signal<string | null> {
  const route = inject(ActivatedRoute);

  return toSignal(route.paramMap.pipe(map(pm => pm.get(paramName))), {
    initialValue: route.snapshot.paramMap.get(paramName),
  });
}

/**
 * Creates a signal that tracks the entire route parameter map.
 * Useful when you need access to multiple parameters.
 *
 * @returns A signal containing the full ParamMap
 *
 * @example
 * ```typescript
 * const params = routeParamsMapSignal();
 * const id = params().get('id');
 * ```
 */
export function routeParamsMapSignal(): Signal<ParamMap> {
  const route = inject(ActivatedRoute);

  return toSignal(route.paramMap, {
    initialValue: route.snapshot.paramMap,
  });
}
