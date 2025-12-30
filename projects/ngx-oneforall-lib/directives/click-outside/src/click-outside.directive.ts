
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
  DOCUMENT
} from '@angular/core';

/**
 * Emits when a click occurs outside the host element.
 * Useful for closing dropdowns, modals, and menus.
 *
 * @example
 * ```html
 * <div (clickOutside)="close()">Dropdown content</div>
 * ```
 */
@Directive({
  selector: '[clickOutside]',
})
export class ClickOutsideDirective implements OnDestroy {
  /** Emits the click event when clicked outside */
  clickOutside = output<Event>();
  /** Enable/disable the directive */
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
      this.document.addEventListener('click', this.onClickListener, true);
    });
  }

  private removeListener() {
    this.document.removeEventListener('click', this.onClickListener, true);
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
