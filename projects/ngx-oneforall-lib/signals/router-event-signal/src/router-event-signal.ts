import { inject, computed, signal } from '@angular/core';
import {
  Router,
  Event,
  RouterEvent,
  NavigationStart,
  NavigationEnd,
} from '@angular/router';
import { filter } from 'rxjs';
import { DestroyRef } from '@angular/core';

/**
 * Creates signals that track Angular Router events.
 * Provides the raw event and convenience computed signals for common navigation states.
 *
 * @returns Object with event signal and navigation state helpers
 *
 * @example
 * ```typescript
 * const router = routerEventSignal();
 * if (router.isNavigationStart()) {
 *   showLoadingSpinner();
 * }
 * ```
 */
export function routerEventSignal() {
  const router = inject(Router);
  const destroyRef = inject(DestroyRef);
  const event = signal<RouterEvent | null>(null);

  const sub = router.events
    .pipe(
      filter(
        (e: Event | RouterEvent): e is RouterEvent => e instanceof RouterEvent
      )
    )
    .subscribe(ev => event.set(ev));

  destroyRef.onDestroy(() => sub.unsubscribe());

  return {
    /** Current router event */
    event: event.asReadonly(),
    /** True during navigation start */
    isNavigationStart: computed(() => event() instanceof NavigationStart),
    /** True at navigation end */
    isNavigationEnd: computed(() => event() instanceof NavigationEnd),
  };
}
