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
  repeat = input(1, { transform: numberAttribute });

  private readonly templateRef = inject(TemplateRef<unknown>);
  private readonly viewContainerRef = inject(ViewContainerRef);

  constructor() {
    effect(() => this.repeatTemplate());
  }

  private repeatTemplate() {
    this.viewContainerRef.clear();

    for (let i = 0; i < this.repeat(); i++) {
      const context = {
        $implicit: i,
        index: i,
        first: i === 0,
        last: i === this.repeat() - 1,
      };
      this.viewContainerRef.createEmbeddedView(this.templateRef, context);
    }
  }
}
