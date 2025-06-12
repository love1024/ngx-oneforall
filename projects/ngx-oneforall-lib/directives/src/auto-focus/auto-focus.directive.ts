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

@Directive({
  selector: '[autoFocus]',
  host: {
    '(focus)': 'hostFocused()',
    '(blur)': 'hostBlured()',
  },
})
export class AutoFocusDirective {
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

  hostBlured() {
    this.isFocused.set(false);
  }

  private focus() {
    console.log(this.isFocused());
    if (this.isFocused()) {
      this.hostEl?.nativeElement.focus();
    }
  }
}
