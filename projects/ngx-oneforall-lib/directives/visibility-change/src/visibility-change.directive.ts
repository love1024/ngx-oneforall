import {
  afterNextRender,
  Directive,
  effect,
  ElementRef,
  EnvironmentInjector,
  inject,
  input,
  NgZone,
  OnDestroy,
  output,
  runInInjectionContext,
  untracked,
} from '@angular/core';

export type VisibilityChange =
  | {
      isVisible: true;
      target: HTMLElement;
    }
  | {
      isVisible: false;
      target: HTMLElement | undefined;
    };

@Directive({
  selector: '[visibilityChange]',
})
export class VisibilityChangeDirective implements OnDestroy {
  /** Visibility threshold (0-1), 1.0 = fully visible */
  threshold = input<number>(1.0);
  /** Root element for intersection (null = viewport) */
  root = input<HTMLElement | null>(null);
  /** Root margin for intersection area */
  rootMargin = input<string>('0px');

  /** Emits when element visibility changes */
  visibilityChange = output<VisibilityChange>();

  private readonly hostEl = inject(ElementRef);
  private readonly environment = inject(EnvironmentInjector);
  private readonly ngZone = inject(NgZone);
  private observer: IntersectionObserver | undefined;
  private isVisible = false;

  constructor() {
    afterNextRender(() => {
      runInInjectionContext(this.environment, () => {
        effect(() => {
          // Track inputs
          this.threshold();
          this.root();
          this.rootMargin();

          // Connect without tracking
          untracked(() => this.connectObserver());
        });
      });
    });
  }

  ngOnDestroy(): void {
    this.disconnectObserver();
    this.visibilityChange.emit({
      isVisible: false,
      target: undefined,
    });
  }

  private connectObserver() {
    this.disconnectObserver();

    this.ngZone.runOutsideAngular(() => {
      this.observer = new IntersectionObserver(
        entries => {
          entries.forEach(entry => {
            const { isIntersecting: isVisible, target } = entry;
            const hasChangedVisibility = isVisible !== this.isVisible;
            if (hasChangedVisibility) {
              this.ngZone.run(() => {
                this.visibilityChange.emit({
                  isVisible,
                  target: target as HTMLElement,
                });
              });
              this.isVisible = isVisible;
            }
          });
        },
        {
          root: this.root(),
          rootMargin: this.rootMargin(),
          threshold: this.threshold(),
        }
      );

      this.observer.observe(this.hostEl.nativeElement);
    });
  }

  private disconnectObserver() {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = undefined;
    }
  }
}
