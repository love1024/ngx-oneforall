import {
  afterNextRender,
  DestroyRef,
  Directive,
  ElementRef,
  inject,
  input,
  numberAttribute,
  output,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { fromEvent, throttleTime } from 'rxjs';

@Directive({
  selector: '[clickThrottle]',
})
export class ClickThrottleDirective {
  throttleTime = input(1000, { transform: numberAttribute });

  clickThrottle = output<Event>();

  private hostEl = inject(ElementRef);
  private destroyRef = inject(DestroyRef);

  constructor() {
    afterNextRender(() => {
      this.subscribeToClickEvent();
    });
  }

  private subscribeToClickEvent() {
    fromEvent(this.hostEl.nativeElement, 'click')
      .pipe(
        throttleTime(this.throttleTime()),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(evt => this.clickThrottle.emit(evt as Event));
  }
}
