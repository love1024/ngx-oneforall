import { isPlatformBrowser } from '@angular/common';
import {
  signal,
  inject,
  NgZone,
  DestroyRef,
  Signal,
  PLATFORM_ID,
} from '@angular/core';

/**
 * Creates a signal that tracks DOM events on a target element.
 * Runs outside Angular zone for performance and auto-cleans up on destroy.
 *
 * @param target - The EventTarget to listen on (window, document, element)
 * @param eventName - Name of the event to listen for
 * @param options - Optional event listener options
 * @returns A read-only signal containing the latest event or null
 *
 * @example
 * ```typescript
 * const clicks = eventSignal(document, 'click');
 * effect(() => console.log(clicks()?.target));
 * ```
 */
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
