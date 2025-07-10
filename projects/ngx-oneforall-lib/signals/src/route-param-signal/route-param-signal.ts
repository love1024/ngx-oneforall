import { inject, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { map } from 'rxjs';

export function routeParamSignal(paramName: string): Signal<string | null> {
  const route = inject(ActivatedRoute);

  return toSignal(route.paramMap.pipe(map(pm => pm.get(paramName))), {
    initialValue: route.snapshot.paramMap.get(paramName),
  });
}

export function routeParamsMapSignal(): Signal<ParamMap> {
  const route = inject(ActivatedRoute);

  return toSignal(route.paramMap, {
    initialValue: route.snapshot.paramMap,
  });
}
