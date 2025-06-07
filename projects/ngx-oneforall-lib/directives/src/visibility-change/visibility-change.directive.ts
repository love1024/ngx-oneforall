import {
  afterNextRender,
  Directive,
  ElementRef,
  inject,
  input,
  OnDestroy,
  output,
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
  threshold = input<number>(1.0);
  root = input<HTMLElement | null>(null);
  visibilityChange = output<VisibilityChange>();

  private readonly hostEl = inject(ElementRef);
  private observer: IntersectionObserver | undefined;
  private isVisible = false;

  constructor() {
    afterNextRender(() => this.connectObserver());
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

    this.observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          const { isIntersecting: isVisible, target } = entry;
          const hasChangedVisibility = isVisible !== this.isVisible;
          if (hasChangedVisibility) {
            this.visibilityChange.emit({
              isVisible,
              target: target as HTMLElement,
            });
            this.isVisible = isVisible;
          }
        });
      },
      {
        root: this.root(),
        threshold: this.threshold(),
      }
    );

    this.observer.observe(this.hostEl.nativeElement);
  }

  private disconnectObserver() {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = undefined;
    }
  }
}
