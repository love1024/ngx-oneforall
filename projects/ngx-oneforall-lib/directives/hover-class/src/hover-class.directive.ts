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

/**
 * Adds CSS classes to an element on hover.
 * Supports multiple space-separated classes and can be conditionally enabled.
 *
 * @example
 * ```html
 * <div hoverClass="bg-blue-500 text-white">Hover me</div>
 * <div hoverClass="highlight" [hoverClassEnabled]="canHighlight">Conditional</div>
 * ```
 */
@Directive({
  selector: '[hoverClass]',
  host: {
    '(mouseenter)': 'onMouseEnter()',
    '(mouseleave)': 'onMouseLeave()',
  },
})
export class HoverClassDirective {
  /** CSS class(es) to apply on hover (space-separated) */
  hoverClass = input.required<string>();
  /** Enable/disable hover effect */
  hoverClassEnabled = input<boolean>(true);
  /** Current applied class */
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
