import { inject, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { map } from 'rxjs';

export function routeQueryParamSignal(
  paramName: string
): Signal<string | null> {
  const route = inject(ActivatedRoute);

  return toSignal(route.queryParamMap.pipe(map(pm => pm.get(paramName))), {
    initialValue: route.snapshot.queryParamMap.get(paramName),
  });
}

export function routeQueryParamsMapSignal(): Signal<ParamMap> {
  const route = inject(ActivatedRoute);

  return toSignal(route.queryParamMap, {
    initialValue: route.snapshot.queryParamMap,
  });
}
