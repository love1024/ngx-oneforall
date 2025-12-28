import {
  afterNextRender,
  DestroyRef,
  Directive,
  effect,
  ElementRef,
  EnvironmentInjector,
  inject,
  input,
  numberAttribute,
  output,
  runInInjectionContext,
  VERSION,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { fromEvent, Subscription, throttleTime } from 'rxjs';

/**
 * Throttles click events to prevent rapid repeated clicks.
 * Useful for preventing double-submissions and rate limiting actions.
 *
 * @example
 * ```html
 * <button (clickThrottle)="submit()">Submit</button>
 * <button (clickThrottle)="submit()" [throttleTime]="500">Fast Submit</button>
 * ```
 */
@Directive({
  selector: '[clickThrottle]',
})
export class ClickThrottleDirective {
  /** Throttle duration in milliseconds */
  throttleTime = input(1000, { transform: numberAttribute });

  /** Emits throttled click events */
  clickThrottle = output<Event>();

  private hostEl = inject(ElementRef);
  private environment = inject(EnvironmentInjector);
  private destroyRef = inject(DestroyRef);
  private subscription?: Subscription;

  constructor() {
    afterNextRender(() => {
      runInInjectionContext(this.environment, () => {
        effect(() => this.subscribeToClickEvent(), {
          allowSignalWrites: VERSION.major < '19' || undefined,
        });
      });
    });
  }

  private subscribeToClickEvent() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }

    this.subscription = fromEvent(this.hostEl.nativeElement, 'click')
      .pipe(
        throttleTime(this.throttleTime()),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(evt => this.clickThrottle.emit(evt as Event));
  }
}
