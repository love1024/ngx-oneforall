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
  VERSION,
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
  hoverClassEnabled = input<boolean>(true);
  elementClass = signal<string>('');

  private classesToToggle = signal<string[]>([]);

  private readonly environment = inject(EnvironmentInjector);
  private readonly hostEl = inject(ElementRef);
  private readonly renderer = inject(Renderer2);

  constructor() {
    afterNextRender(() => {
      runInInjectionContext(this.environment, () => {
        effect(
          () => {
            this.setClasses();
          },
          {
            allowSignalWrites: VERSION.major < '19' || undefined,
          }
        );

        effect(
          () => {
            // Remove classes if disabled
            if (!this.hoverClassEnabled()) {
              const classes = this.classesToToggle();
              classes.forEach(cls => {
                this.renderer.removeClass(this.hostEl.nativeElement, cls);
              });
            }
          },
          {
            allowSignalWrites: VERSION.major < '19' || undefined,
          }
        );
      });
    });
  }

  onMouseEnter() {
    if (!this.hoverClassEnabled()) {
      return;
    }
    this.classesToToggle().forEach(cls => {
      this.renderer.addClass(this.hostEl.nativeElement, cls);
    });
  }

  onMouseLeave() {
    if (!this.hoverClassEnabled()) {
      return;
    }
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
