import {
  Directive,
  effect,
  inject,
  input,
  numberAttribute,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';

@Directive({
  selector: '[repeat]',
})
export class RepeatDirective {
  /** Number of times to repeat the template */
  repeat = input(1, { transform: numberAttribute });

  private readonly templateRef = inject(TemplateRef<unknown>);
  private readonly viewContainerRef = inject(ViewContainerRef);

  constructor() {
    effect(() => {
      const count = this.repeat();
      this.repeatTemplate(count);
    });
  }

  private repeatTemplate(count: number) {
    this.viewContainerRef.clear();

    const safeCount = Math.max(0, count);
    for (let i = 0; i < safeCount; i++) {
      const context = {
        $implicit: i,
        index: i,
        first: i === 0,
        last: i === safeCount - 1,
        even: i % 2 === 0,
        odd: i % 2 !== 0,
      };
      this.viewContainerRef.createEmbeddedView(this.templateRef, context);
    }
  }
}
