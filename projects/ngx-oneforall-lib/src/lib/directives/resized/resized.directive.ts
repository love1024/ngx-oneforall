import {
    afterNextRender,
    Directive,
    ElementRef,
    inject,
    NgZone,
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
 * This directive uses the `ResizeObserver` API to monitor size changes and emits
 * the current and previous dimensions of the element.
 *
 * @example
 * ```html
 * <div resized (resized)="onResized($event)">
 *   Resize me!
 * </div>
 * ```
 *
 * ```typescript
 * import { Component } from '@angular/core';
 * import { ResizedEvent } from './resized.directive';
 *
 * @Component({
 *   selector: 'app-root',
 *   template: `
 *     <div resized (resized)="onResized($event)">
 *       Resize me!
 *     </div>
 *   `,
 *   styleUrls: ['./app.component.css']
 * })
 * export class AppComponent {
 *   onResized(event: ResizedEvent): void {
 *     console.log('Current size:', event.current);
 *     console.log('Previous size:', event.previous);
 *   }
 * }
 * ```
 *
 * @selector [resized]
 * @export
 * @class ResizedDirective
 * @implements OnDestroy
 */
@Directive({ selector: '[resized]' })
export class ResizedDirective implements OnDestroy {
    resized = output<ResizedEvent>();

    private element = inject(ElementRef);
    private zone = inject(NgZone);
    private observer?: ResizeObserver;
    private previousRect: DOMRectReadOnly | null = null;

    constructor() {
        afterNextRender(() => {
            this.observer = new ResizeObserver(entries =>
                this.zone.run(() => this.handleResize(entries))
            );
            const nativeElement = this.element.nativeElement;
            this.observer?.observe(nativeElement);
        });
    }

    ngOnDestroy(): void {
        this.observer?.disconnect();
    }

    private handleResize(entries: ResizeObserverEntry[]): void {
        if (entries.length === 0) {
            return;
        }
        const domSize = entries[0];
        const currentRect = domSize.contentRect;
        this.resized.emit({ current: currentRect, previous: this.previousRect });
        this.previousRect = currentRect;
    }
}