import { AfterViewInit, Directive, ElementRef, inject, input, NgZone, OnDestroy, output, PLATFORM_ID, Renderer2, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Directive({
  selector: '[infiniteScroll]'
})
export class InfiniteScrollDirective implements AfterViewInit, OnDestroy {
  bottomMargin = input<number>(20);
  useWindow = input<boolean>(true);
  disabled = input<boolean>(false);
  checkOnInit = input<boolean>(true);
  scrollContainer = input<string | null>(null);

  scrolled = output<void>();

  private scrollableParent = signal<HTMLElement | Window | null>(null);
  private observer = signal<IntersectionObserver | null>(null);
  private targetElement = signal<HTMLElement | null>(null);

  private readonly platformId = inject(PLATFORM_ID);
  private readonly renderer = inject(Renderer2);
  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly ngZone = inject(NgZone);



  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.initialize();
    }
  }

  ngOnDestroy(): void {
    this.observer()?.disconnect();
    this.targetElement()?.remove();
  }

  private initialize() {
    if (typeof IntersectionObserver === 'undefined') {
      throw new Error('IntersectionObserver is not supported in this browser');
    }

    if (!this.host?.nativeElement) {
      throw new Error('Host element not found');
    }

    if (this.disabled()) return;

    this.addTargetElement();
    this.setScrollParent
    this.setupObserver();
  }

  private setupObserver() {
    this.ngZone.runOutsideAngular(() => {
      const rootMargin = `0px 0px ${this.bottomMargin()}% 0px`;
      const options: IntersectionObserverInit = {
        root: this.scrollableParent() instanceof Window ? null : (this.scrollableParent() as HTMLElement),
        rootMargin,
        threshold: 0,
      };

      this.observer.set(new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (this.disabled()) return;

          // If checkOnInit is false, we ignore any intersection that happens
          // within the first 1000ms (e.g. due to scroll restoration after page refresh).
          if (entry.time < 1000 && !this.checkOnInit()) {
            return;
          }

          if (entry.isIntersecting) {
            this.ngZone.run(() => this.emitScroll());
          }
        });
      }, options));

      this.observer()?.observe(this.targetElement()!);
    });
  }

  private setScrollParent() {
    if (this.useWindow()) {
      this.scrollableParent.set(null);
    } else if (this.scrollContainer()) {
      const el = document.querySelector(this.scrollContainer()!);
      if (!el) {
        throw new Error('Container element not found');
      }
      this.scrollableParent.set(el as HTMLElement);
    } else {
      this.scrollableParent.set(this.findScrollableParent(this.host.nativeElement) || this.host.nativeElement);
    }
  }

  private addTargetElement() {
    const el = this.renderer.createElement('div');
    this.renderer.setStyle(el, 'width', '1px');
    this.renderer.setStyle(el, 'height', '1px');
    this.renderer.setStyle(el, 'visibility', 'hidden');
    this.renderer.setAttribute(el, 'aria-hidden', 'true');

    this.targetElement.set(el);
    this.host.nativeElement.appendChild(el);
  }

  private findScrollableParent(el: HTMLElement | null): HTMLElement | null {
    let node: HTMLElement | null = el;
    while (node && node !== document.documentElement && node !== document.body) {
      const style = window.getComputedStyle(node);
      const overflowY = style.overflowY;
      const isScrollable = overflowY === 'auto' || overflowY === 'scroll' || overflowY === 'overlay';
      if (isScrollable && node.scrollHeight > node.clientHeight) {
        return node;
      }
      node = node.parentElement;
    }
    return null;
  }

  private emitScroll() {
    this.scrolled.emit();
  }
}
