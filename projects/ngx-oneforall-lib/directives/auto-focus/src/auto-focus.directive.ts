import {
  afterNextRender,
  Directive,
  effect,
  ElementRef,
  EnvironmentInjector,
  inject,
  model,
  runInInjectionContext,
} from '@angular/core';

/**
 * Automatically focuses the host element when initialized.
 * Uses a two-way bound model to track and control focus state.
 *
 * @example
 * ```html
 * <input autoFocus />
 * <input autoFocus [(isFocused)]="shouldFocus" />
 * ```
 */
@Directive({
  selector: '[autoFocus]',
  host: {
    '(focus)': 'hostFocused()',
    '(blur)': 'hostBlurred()',
  },
})
export class AutoFocusDirective {
  /** Two-way bound focus state */
  isFocused = model<boolean>(true);

  private hostEl = inject<ElementRef<HTMLElement>>(ElementRef);
  private environmentInjector = inject(EnvironmentInjector);

  constructor() {
    afterNextRender(() => {
      this.focus();

      runInInjectionContext(this.environmentInjector, () => {
        effect(() => this.focus());
      });
    });
  }

  hostFocused() {
    this.isFocused.set(true);
  }

  hostBlurred() {
    this.isFocused.set(false);
  }

  private focus() {
    if (this.isFocused()) {
      this.hostEl?.nativeElement.focus();
    }
  }
}
