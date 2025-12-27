import { DOCUMENT } from '@angular/common';
import {
  afterNextRender,
  booleanAttribute,
  Directive,
  ElementRef,
  inject,
  input,
  NgZone,
  OnDestroy,
  output,
} from '@angular/core';

@Directive({
  selector: '[clickOutside]',
})
export class ClickOutsideDirective implements OnDestroy {
  clickOutside = output<Event>();
  clickOutsideEnabled = input(true, { transform: booleanAttribute });

  private readonly document = inject(DOCUMENT);
  private readonly ngZone = inject(NgZone);
  private readonly hostEl = inject(ElementRef);

  constructor() {
    // Needed this so that we can pass this to add and remove listener
    this.onClickListener = this.onClickListener.bind(this);
    // Run it when in browser
    afterNextRender(() => this.initListener());
  }

  ngOnDestroy(): void {
    this.removeListener();
  }

  private initListener() {
    this.ngZone.runOutsideAngular(() => {
      this.document.addEventListener('click', this.onClickListener);
    });
  }

  private removeListener() {
    this.document.removeEventListener('click', this.onClickListener);
  }

  private onClickListener(evt: Event) {
    if (!this.clickOutsideEnabled()) {
      return;
    }

    if (!this.hostEl.nativeElement.contains(evt.target)) {
      this.ngZone.run(() => this.clickOutside.emit(evt));
    }
  }
}
