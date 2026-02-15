import {
  afterNextRender,
  booleanAttribute,
  Directive,
  ElementRef,
  inject,
  input,
  numberAttribute,
  NgZone,
  OnDestroy,
  output,
  DOCUMENT,
} from '@angular/core';

/**
 * Interface representing the drag event details.
 */
export interface DraggableDragEvent {
  /** Current X position relative to viewport */
  x: number;
  /** Current Y position relative to viewport */
  y: number;
  /** Change in X position since last event */
  deltaX: number;
  /** Change in Y position since last event */
  deltaY: number;
  /** The original mouse/touch event */
  originalEvent: MouseEvent | TouchEvent;
}

/**
 * A directive that makes an element draggable.
 * Useful for movable popups, modals, and floating panels.
 * Supports both mouse and touch events.
 *
 * @example
 * ```html
 * <!-- Basic usage where entire element is draggable -->
 * <div makeDraggable (dragMove)="onDrag($event)">
 *   Drag me!
 * </div>
 * ```
 *
 * @example
 * ```html
 * <!-- Modal with draggable header -->
 * <div class="modal" #modal>
 *   <div class="modal-header" makeDraggable [makeDraggableTarget]="modal">
 *     Drag Header
 *   </div>
 *   <div class="modal-body">Content</div>
 * </div>
 * ```
 *
 * @example
 * ```html
 * <!-- With boundary constraints -->
 * <div makeDraggable
 *      [makeDraggableBoundary]="'viewport'"
 *      (dragStart)="onStart($event)"
 *      (dragMove)="onMove($event)"
 *      (dragEnd)="onEnd($event)">
 *   Constrained drag
 * </div>
 * ```
 */
@Directive({
  selector: '[makeDraggable]',
  host: {
    '[style.cursor]': 'makeDraggableEnabled() ? "grab" : null',
    '[style.user-select]': 'isDragging ? "none" : null',
  },
})
export class DraggableDirective implements OnDestroy {
  /** Enable/disable the directive */
  makeDraggableEnabled = input(true, { transform: booleanAttribute });

  /**
   * Target element to move. If not provided, moves the host element.
   * Use this when the drag handle (e.g., modal header) is different from the element to move.
   */
  makeDraggableTarget = input<HTMLElement | null>(null);

  /**
   * Boundary constraint for dragging.
   * - 'viewport': Constrains to the browser viewport
   * - 'parent': Constrains to the parent element
   * - HTMLElement: Constrains to the specified element
   * - null: No constraints (default)
   */
  makeDraggableBoundary = input<'viewport' | 'parent' | HTMLElement | null>(
    null
  );

  /**
   * Minimum distance in pixels the user must move before dragging starts.
   * Useful to prevent accidental drags when clicking.
   */
  makeDraggableThreshold = input(5, { transform: numberAttribute });

  /** Emits when dragging starts */
  dragStart = output<DraggableDragEvent>();

  /** Emits continuously while dragging */
  dragMove = output<DraggableDragEvent>();

  /** Emits when dragging ends */
  dragEnd = output<DraggableDragEvent>();

  /** Whether the element is currently being dragged */
  isDragging = false;

  private readonly document = inject(DOCUMENT);
  private readonly ngZone = inject(NgZone);
  private readonly hostEl = inject(ElementRef<HTMLElement>);

  private pointerDownX = 0;
  private pointerDownY = 0;
  private startX = 0;
  private startY = 0;
  private initialLeft = 0;
  private initialTop = 0;
  private lastX = 0;
  private lastY = 0;

  constructor() {
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
    this.onTouchStart = this.onTouchStart.bind(this);
    this.onTouchMove = this.onTouchMove.bind(this);
    this.onTouchEnd = this.onTouchEnd.bind(this);

    afterNextRender(() => this.initListeners());
  }

  ngOnDestroy(): void {
    this.removeListeners();
    this.removeDragListeners();
  }

  private get targetElement(): HTMLElement {
    return this.makeDraggableTarget() ?? this.hostEl.nativeElement;
  }

  private initListeners(): void {
    this.ngZone.runOutsideAngular(() => {
      const el = this.hostEl.nativeElement;
      el.addEventListener('mousedown', this.onMouseDown);
      el.addEventListener('touchstart', this.onTouchStart, { passive: false });
    });
  }

  private removeListeners(): void {
    const el = this.hostEl.nativeElement;
    el.removeEventListener('mousedown', this.onMouseDown);
    el.removeEventListener('touchstart', this.onTouchStart);
  }

  private addDragListeners(): void {
    this.document.addEventListener('mousemove', this.onMouseMove);
    this.document.addEventListener('mouseup', this.onMouseUp);
    this.document.addEventListener('touchmove', this.onTouchMove, {
      passive: false,
    });
    this.document.addEventListener('touchend', this.onTouchEnd);
    this.document.addEventListener('touchcancel', this.onTouchEnd);
  }

  private removeDragListeners(): void {
    this.document.removeEventListener('mousemove', this.onMouseMove);
    this.document.removeEventListener('mouseup', this.onMouseUp);
    this.document.removeEventListener('touchmove', this.onTouchMove);
    this.document.removeEventListener('touchend', this.onTouchEnd);
    this.document.removeEventListener('touchcancel', this.onTouchEnd);
  }

  private onMouseDown(event: MouseEvent): void {
    if (!this.makeDraggableEnabled() || event.button !== 0) {
      return;
    }
    // Don't prevent default yet, wait until drag starts
    this.initDrag(event.clientX, event.clientY);
  }

  private onTouchStart(event: TouchEvent): void {
    if (!this.makeDraggableEnabled() || event.touches.length !== 1) {
      return;
    }
    // Don't prevent default yet
    // event.preventDefault();
    const touch = event.touches[0];
    this.initDrag(touch.clientX, touch.clientY);
  }

  private initDrag(x: number, y: number): void {
    this.pointerDownX = x;
    this.pointerDownY = y;
    this.isDragging = false;

    this.ngZone.runOutsideAngular(() => {
      this.addDragListeners();
    });
  }

  private onMouseMove(event: MouseEvent): void {
    this.handleMove(event.clientX, event.clientY, event);
  }

  private onTouchMove(event: TouchEvent): void {
    if (event.touches.length !== 1) {
      return;
    }
    const touch = event.touches[0];
    this.handleMove(touch.clientX, touch.clientY, event);
  }

  private handleMove(
    x: number,
    y: number,
    originalEvent: MouseEvent | TouchEvent
  ): void {
    if (!this.isDragging) {
      const deltaX = Math.abs(x - this.pointerDownX);
      const deltaY = Math.abs(y - this.pointerDownY);
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

      if (distance >= this.makeDraggableThreshold()) {
        if (originalEvent.cancelable) {
          originalEvent.preventDefault();
        }
        this.startDrag(this.pointerDownX, this.pointerDownY, originalEvent);
        // Immediately move to current position to avoid lag
        this.moveDrag(x, y, originalEvent);
      }
    } else {
      if (originalEvent.cancelable) {
        originalEvent.preventDefault();
      }
      this.moveDrag(x, y, originalEvent);
    }
  }

  private onMouseUp(event: MouseEvent): void {
    this.handleUp(event.clientX, event.clientY, event);
  }

  private onTouchEnd(event: TouchEvent): void {
    this.handleUp(this.lastX, this.lastY, event);
  }

  private handleUp(
    x: number,
    y: number,
    originalEvent: MouseEvent | TouchEvent
  ): void {
    if (this.isDragging) {
      this.endDrag(x, y, originalEvent);
    } else {
      // Clean up if drag never started (it was a click)
      this.removeDragListeners();
    }
  }

  private startDrag(
    x: number,
    y: number,
    originalEvent: MouseEvent | TouchEvent
  ): void {
    this.isDragging = true;
    this.startX = x;
    this.startY = y;
    this.lastX = x;
    this.lastY = y;

    const target = this.targetElement;
    const style = this.document.defaultView?.getComputedStyle(target);
    this.initialLeft = parseFloat(style?.left || '0') || 0;
    this.initialTop = parseFloat(style?.top || '0') || 0;

    // Ensure the target has position for movement
    if (style?.position === 'static') {
      target.style.position = 'relative';
    }

    this.hostEl.nativeElement.style.cursor = 'grabbing';
    this.hostEl.nativeElement.style.userSelect = 'none';

    const dragEvent = this.createDraggableDragEvent(x, y, 0, 0, originalEvent);
    this.ngZone.run(() => this.dragStart.emit(dragEvent));
  }

  private moveDrag(
    x: number,
    y: number,
    originalEvent: MouseEvent | TouchEvent
  ): void {
    const deltaX = x - this.lastX;
    const deltaY = y - this.lastY;
    this.lastX = x;
    this.lastY = y;

    let newLeft = this.initialLeft + (x - this.startX);
    let newTop = this.initialTop + (y - this.startY);

    const constrained = this.applyBoundaryConstraints(newLeft, newTop);
    newLeft = constrained.left;
    newTop = constrained.top;

    const target = this.targetElement;
    target.style.left = `${newLeft}px`;
    target.style.top = `${newTop}px`;

    const dragEvent = this.createDraggableDragEvent(
      x,
      y,
      deltaX,
      deltaY,
      originalEvent
    );
    this.ngZone.run(() => this.dragMove.emit(dragEvent));
  }

  private endDrag(
    x: number,
    y: number,
    originalEvent: MouseEvent | TouchEvent
  ): void {
    this.isDragging = false;
    this.removeDragListeners();

    this.hostEl.nativeElement.style.cursor = 'grab';

    const dragEvent = this.createDraggableDragEvent(
      x,
      y,
      x - this.lastX,
      y - this.lastY,
      originalEvent
    );
    this.ngZone.run(() => this.dragEnd.emit(dragEvent));
  }

  private applyBoundaryConstraints(
    left: number,
    top: number
  ): { left: number; top: number } {
    const boundary = this.makeDraggableBoundary();
    if (!boundary) {
      return { left, top };
    }

    const target = this.targetElement;
    const targetRect = target.getBoundingClientRect();

    // Get current CSS values to calculate the natural position
    const style = this.document.defaultView?.getComputedStyle(target);
    const currentCssLeft = parseFloat(style?.left || '0') || 0;
    const currentCssTop = parseFloat(style?.top || '0') || 0;

    // Natural position = viewport position - CSS offset
    // This is where the element would be without any CSS left/top applied
    const naturalLeft = targetRect.left - currentCssLeft;
    const naturalTop = targetRect.top - currentCssTop;

    let boundaryRect: DOMRect;

    if (boundary === 'viewport') {
      const view = this.document.defaultView;
      boundaryRect = new DOMRect(
        0,
        0,
        view?.innerWidth ?? 0,
        view?.innerHeight ?? 0
      );
    } else if (boundary === 'parent') {
      const parent = target.parentElement;
      if (!parent) {
        return { left, top };
      }
      boundaryRect = parent.getBoundingClientRect();
    } else {
      boundaryRect = boundary.getBoundingClientRect();
    }

    // Calculate min/max CSS values that keep element within boundary
    // Element left edge in viewport = naturalLeft + cssLeft >= boundaryRect.left
    // Element right edge in viewport = naturalLeft + cssLeft + width <= boundaryRect.right
    const minLeft = boundaryRect.left - naturalLeft;
    const maxLeft = boundaryRect.right - targetRect.width - naturalLeft;
    const minTop = boundaryRect.top - naturalTop;
    const maxTop = boundaryRect.bottom - targetRect.height - naturalTop;

    return {
      left: Math.max(minLeft, Math.min(maxLeft, left)),
      top: Math.max(minTop, Math.min(maxTop, top)),
    };
  }

  private createDraggableDragEvent(
    x: number,
    y: number,
    deltaX: number,
    deltaY: number,
    originalEvent: MouseEvent | TouchEvent
  ): DraggableDragEvent {
    return { x, y, deltaX, deltaY, originalEvent };
  }
}
