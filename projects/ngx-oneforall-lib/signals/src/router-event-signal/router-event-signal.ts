import { inject, computed, signal } from '@angular/core';
import { Router, Event, RouterEvent, NavigationStart, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { DestroyRef } from '@angular/core';

export function routerEventSignal() {
    const router = inject(Router);
    const destroyRef = inject(DestroyRef);
    const event = signal<RouterEvent | null>(null);

    const sub = router.events
        .pipe(
            filter((e: Event | RouterEvent): e is RouterEvent => e instanceof RouterEvent)
        )
        .subscribe(ev => event.set(ev));

    destroyRef.onDestroy(() => sub.unsubscribe());

    return {
        event: event.asReadonly(),
        isNavigationStart: computed(() => event() instanceof NavigationStart),
        isNavigationEnd: computed(() => event() instanceof NavigationEnd),
    };
}
