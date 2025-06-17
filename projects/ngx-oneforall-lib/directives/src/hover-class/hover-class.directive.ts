import {
  Directive,
  effect,
  ElementRef,
  inject,
  input,
  Renderer2,
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

  private readonly hostEl = inject(ElementRef);
  private readonly renderer = inject(Renderer2);
  private classesToToggle = signal<string[]>([]);

  constructor() {
    effect(() => {
      const classes = this.hoverClass()
        .split(' ')
        .filter(c => !!c.trim());
      this.classesToToggle.set(classes);
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
}
