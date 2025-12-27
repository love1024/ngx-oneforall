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
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { fromEvent, Subscription, throttleTime } from 'rxjs';

@Directive({
  selector: '[clickThrottle]',
})
export class ClickThrottleDirective {
  throttleTime = input(1000, { transform: numberAttribute });

  clickThrottle = output<Event>();

  private hostEl = inject(ElementRef);
  private environment = inject(EnvironmentInjector);
  private destroyRef = inject(DestroyRef);
  private subscription?: Subscription;

  constructor() {
    afterNextRender(() => {
      this.subscribeToClickEvent();
      runInInjectionContext(this.environment, () => {
        effect(() => this.subscribeToClickEvent());
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
