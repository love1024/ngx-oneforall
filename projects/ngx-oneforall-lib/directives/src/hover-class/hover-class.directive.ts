import {
  afterNextRender,
  Directive,
  effect,
  ElementRef,
  EnvironmentInjector,
  inject,
  input,
  Renderer2,
  runInInjectionContext,
  signal,
} from '@angular/core';

@Directive({
  selector: '[hoverClass]',
  host: {
    '(mouseenter)': 'onMouseEnter()',
    '(mouseleave)': 'onMouseLeave()',
  },
})
export class HoverClassDirective {
  hoverClass = input.required<string>();
  elementClass = signal<string>('');

  private classesToToggle = signal<string[]>([]);

  private readonly environment = inject(EnvironmentInjector);
  private readonly hostEl = inject(ElementRef);
  private readonly renderer = inject(Renderer2);

  constructor() {
    afterNextRender(() => {
      this.setClasses();
      runInInjectionContext(this.environment, () => {
        effect(() => {
          this.setClasses();
        });
      });
    });
  }

  onMouseEnter() {
    this.classesToToggle().forEach(cls => {
      this.renderer.addClass(this.hostEl.nativeElement, cls);
    });
  }

  onMouseLeave() {
    this.classesToToggle().forEach(cls => {
      this.renderer.removeClass(this.hostEl.nativeElement, cls);
    });
  }

  private setClasses() {
    const classes = this.hoverClass()
      .split(' ')
      .filter(c => !!c.trim());
    this.classesToToggle.set(classes);
  }
}
