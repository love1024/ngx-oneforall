import { isPlatformBrowser } from '@angular/common';
import {
  signal,
  inject,
  NgZone,
  DestroyRef,
  Signal,
  PLATFORM_ID,
} from '@angular/core';

export function eventSignal<T = Event>(
  target: EventTarget,
  eventName: string,
  options?: AddEventListenerOptions
): Signal<T | null> {
  const platformId = inject(PLATFORM_ID);
  const zone = inject(NgZone);
  const destroyRef = inject(DestroyRef);

  const s = signal<T | null>(null);

  if (isPlatformBrowser(platformId)) {
    zone.runOutsideAngular(() => {
      const handler = (event: Event) => {
        zone.run(() => s.set(event as T));
      };

      target.addEventListener(eventName, handler, options);

      destroyRef.onDestroy(() => {
        target.removeEventListener(eventName, handler, options);
      });
    });
  }

  return s.asReadonly();
}
