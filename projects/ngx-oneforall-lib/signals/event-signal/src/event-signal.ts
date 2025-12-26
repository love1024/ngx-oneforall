import { signal, WritableSignal, inject, NgZone, DestroyRef } from '@angular/core';

export function eventSignal<T = Event>(
    target: EventTarget,
    eventName: string,
    options?: AddEventListenerOptions
): WritableSignal<T | null> {

    const zone = inject(NgZone);
    const destroyRef = inject(DestroyRef);

    const s = signal<T | null>(null);

    zone.runOutsideAngular(() => {
        console.log('Running outside angular');
        const handler = (event: Event) => {
            console.log('Event triggered', event.type);
            zone.run(() => s.set(event as T));
        };

        target.addEventListener(eventName, handler, options);
        console.log('Listener added');

        destroyRef.onDestroy(() => {
            target.removeEventListener(eventName, handler, options);
        });
    });

    return s;
}
