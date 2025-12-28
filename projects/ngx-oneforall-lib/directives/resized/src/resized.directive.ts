import {
  afterNextRender,
  Directive,
  ElementRef,
  inject,
  input,
  NgZone,
  numberAttribute,
  OnDestroy,
  output,
} from '@angular/core';

/**
 * Interface representing the resized event.
 */
export interface ResizedEvent {
  current: DOMRectReadOnly;
  previous: DOMRectReadOnly | null;
}

/**
 * A directive that emits an event whenever the size of the host element changes.
 * Uses the `ResizeObserver` API to monitor size changes and emits
 * the current and previous dimensions of the element.
 *
 * @example
 * ```html
 * <div (resized)="onResized($event)">
 *   Resize me!
 * </div>
 * ```
 *
 * @example
 * ```html
 * <!-- With debouncing -->
 * <div (resized)="onResized($event)" [debounceTime]="100">
 *   Resize me!
 * </div>
 * ```
 */
@Directive({ selector: '[resized]' })
export class ResizedDirective implements OnDestroy {
  /** Debounce time in milliseconds (0 = no debouncing) */
  debounceTime = input(0, { transform: numberAttribute });

  resized = output<ResizedEvent>();

  private element = inject(ElementRef);
  private zone = inject(NgZone);
  private observer?: ResizeObserver;
  private previousRect: DOMRectReadOnly | null = null;
  private debounceTimer?: ReturnType<typeof setTimeout>;

  constructor() {
    afterNextRender(() => {
      this.zone.runOutsideAngular(() => {
        this.observer = new ResizeObserver(entries => {
          this.handleResize(entries);
        });
        this.observer.observe(this.element.nativeElement);
      });
    });
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }
  }

  private handleResize(entries: ResizeObserverEntry[]): void {
    if (entries.length === 0) {
      return;
    }

    const debounce = this.debounceTime();
    if (debounce > 0) {
      if (this.debounceTimer) {
        clearTimeout(this.debounceTimer);
      }
      this.debounceTimer = setTimeout(() => {
        this.emitResize(entries);
      }, debounce);
    } else {
      this.emitResize(entries);
    }
  }

  private emitResize(entries: ResizeObserverEntry[]): void {
    const currentRect = entries[0].contentRect;
    this.zone.run(() => {
      this.resized.emit({ current: currentRect, previous: this.previousRect });
    });
    this.previousRect = currentRect;
  }
}
