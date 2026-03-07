import {
  DestroyRef,
  Directive,
  effect,
  inject,
  input,
  numberAttribute,
  output,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';

/**
 * Structural directive that shows an element for a specified duration,
 * then removes it (or swaps to an alternate template).
 *
 * @example
 * ```html
 * <div *showFor="5000">This disappears after 5 seconds</div>
 *
 * <div *showFor="3000; then expiredTpl">Limited offer!</div>
 * <ng-template #expiredTpl>Offer expired</ng-template>
 * ```
 */
@Directive({
  selector: '[showFor]',
})
export class ShowForDirective {
  /** Duration in milliseconds to show the element */
  showFor = input.required({ transform: numberAttribute });

  /** Optional template to render after the timer expires */
  showForThen = input<TemplateRef<unknown>>();

  /** Emits when the timer expires */
  showForOnExpired = output<void>();

  private readonly templateRef = inject(TemplateRef<unknown>);
  private readonly viewContainerRef = inject(ViewContainerRef);
  private readonly destroyRef = inject(DestroyRef);
  private timerId: ReturnType<typeof setTimeout> | undefined;

  constructor() {
    effect(() => {
      const duration = this.showFor();
      this.start(duration);
    });

    this.destroyRef.onDestroy(() => this.clearTimer());
  }

  private start(duration: number) {
    this.clearTimer();

    this.viewContainerRef.clear();
    this.viewContainerRef.createEmbeddedView(this.templateRef);

    this.timerId = setTimeout(
      () => {
        this.viewContainerRef.clear();

        const thenTpl = this.showForThen();
        if (thenTpl) {
          this.viewContainerRef.createEmbeddedView(thenTpl);
        }

        this.showForOnExpired.emit();
      },
      Math.max(0, duration)
    );
  }

  private clearTimer() {
    if (this.timerId !== undefined) {
      clearTimeout(this.timerId);
      this.timerId = undefined;
    }
  }
}
