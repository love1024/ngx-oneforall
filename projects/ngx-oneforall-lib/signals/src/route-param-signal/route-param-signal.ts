import { effect, inject, signal, Signal } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

export function routeParamSignal(paramName: string): Signal<string | null> {
  const router = inject(Router);
  const route = inject(ActivatedRoute);

  const param = signal<string | null>(route.snapshot.paramMap.get(paramName));
  effect(() => {
    const sub = router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe(() => param.set(route.snapshot.paramMap.get(paramName)));

    return () => sub.unsubscribe();
  });

  return param.asReadonly();
}
