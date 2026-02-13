import {
  afterNextRender,
  booleanAttribute,
  Directive,
  ElementRef,
  inject,
  input,
  NgZone,
  numberAttribute,
  OnDestroy,
  DOCUMENT,
} from '@angular/core';

/**
 * Automatically scrolls a container when a dragged item is near
 * the top or bottom edges. Apply to a scrollable element.
 *
 * Listens on `document` for drag events so it works reliably
 * with CDK drag-drop and native drag-and-drop.
 *
 * @example
 * ```html
 * <ul dragAutoScroll style="overflow-y: auto; height: 300px">
 *  @for (item of items(); track $index) {
 *   <li draggable="true">{{ item }}</li>
 *  }
 * </ul>
 * ```
 */
@Directive({
  selector: '[dragAutoScroll]',
})
export class DragAutoScrollDirective implements OnDestroy {
  /**
   * Height in px of the edge zone that triggers scrolling.
   * Larger values create a wider activation area.
   */
  dragAutoScrollMargin = input(50, { transform: numberAttribute });

  /**
   * Maximum scroll speed in pixels per animation frame.
   * Actual speed scales linearly with cursor proximity to the edge.
   */
  dragAutoScrollSpeed = input(10, { transform: numberAttribute });

  /** Horizontal tolerance in px outside the container bounds */
  dragAutoScrollTolerance = input(50, { transform: numberAttribute });

  /** Disable the auto-scroll behavior */
  dragAutoScrollDisabled = input(false, { transform: booleanAttribute });

  private readonly el = inject(ElementRef<HTMLElement>);
  private readonly ngZone = inject(NgZone);
  private readonly document = inject(DOCUMENT);

  private animationFrameId: number | null = null;
  private currentSpeed = 0;
  private initialized = false;

  constructor() {
    this.onDragOver = this.onDragOver.bind(this);
    this.onDragStop = this.onDragStop.bind(this);

    afterNextRender(() => this.init());
  }

  ngOnDestroy(): void {
    this.removeListeners();
    this.stopScrolling();
  }

  private init(): void {
    this.ngZone.runOutsideAngular(() => {
      this.document.addEventListener('dragover', this.onDragOver);
      this.document.addEventListener('drop', this.onDragStop);
      this.document.addEventListener('dragend', this.onDragStop);
    });
    this.initialized = true;
  }

  private removeListeners(): void {
    if (!this.initialized) return;
    this.document.removeEventListener('dragover', this.onDragOver);
    this.document.removeEventListener('drop', this.onDragStop);
    this.document.removeEventListener('dragend', this.onDragStop);
  }

  private onDragOver(event: Event): void {
    if (this.dragAutoScrollDisabled()) return;

    const dragEvent = event as DragEvent;
    const cursorY = dragEvent.clientY;
    const cursorX = dragEvent.clientX;

    const container = this.el.nativeElement;
    const rect = container.getBoundingClientRect();
    const margin = this.dragAutoScrollMargin();
    const maxSpeed = this.dragAutoScrollSpeed();
    const tolerance = this.dragAutoScrollTolerance();

    // Ignore if cursor is horizontally outside the container
    if (cursorX < rect.left - tolerance || cursorX > rect.right + tolerance) {
      this.stopScrolling();
      return;
    }

    // Clamp to visible viewport so scrolling triggers even when
    // the container extends beyond the screen edges
    const viewportHeight =
      this.document.defaultView?.innerHeight ?? rect.bottom;
    const visibleTop = Math.max(rect.top, 0);
    const visibleBottom = Math.min(rect.bottom, viewportHeight);

    const distFromTop = cursorY - visibleTop;
    const distFromBottom = visibleBottom - cursorY;

    if (distFromTop < margin) {
      const ratio = Math.min(1, 1 - distFromTop / margin);
      this.currentSpeed = -(maxSpeed * ratio);
      this.startScrolling();
    } else if (distFromBottom < margin) {
      const ratio = Math.min(1, 1 - distFromBottom / margin);
      this.currentSpeed = maxSpeed * ratio;
      this.startScrolling();
    } else {
      // In the center zone: zero the speed but keep the loop alive
      // so direction switches don't stutter from a stop/restart
      this.currentSpeed = 0;
    }
  }

  private onDragStop(): void {
    this.stopScrolling();
  }

  private startScrolling(): void {
    if (this.animationFrameId !== null) return;
    this.scroll();
  }

  private scroll(): void {
    this.el.nativeElement.scrollTop += this.currentSpeed;
    this.animationFrameId = requestAnimationFrame(() => this.scroll());
  }

  private stopScrolling(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    this.currentSpeed = 0;
  }
}
