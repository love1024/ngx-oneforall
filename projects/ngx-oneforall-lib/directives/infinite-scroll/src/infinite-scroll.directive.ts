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
  Renderer2,
  runInInjectionContext,
  signal,
  untracked,
} from '@angular/core';

@Directive({
  selector: '[infiniteScroll]',
})
export class InfiniteScrollDirective implements OnDestroy {
  /** Percentage margin from bottom to trigger scroll event */
  bottomMargin = input<number>(20);
  /** Use window as scroll container instead of closest scrollable parent */
  useWindow = input<boolean>(true);
  /** Disable the infinite scroll behavior */
  disabled = input<boolean>(false);
  /** Emit scrolled event on initial intersection (e.g. page load) */
  checkOnInit = input<boolean>(true);
  /** CSS selector for custom scroll container */
  scrollContainer = input<string | null>(null);
  /** Delay (ms) to ignore initial intersections when checkOnInit is false */
  initDelay = input<number>(1000);

  scrolled = output<void>();

  /** Root element for IntersectionObserver (null = viewport/window) */
  private observerRoot = signal<HTMLElement | null>(null);
  private observer = signal<IntersectionObserver | null>(null);
  private targetElement = signal<HTMLElement | null>(null);

  private readonly renderer = inject(Renderer2);
  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly ngZone = inject(NgZone);
  private readonly environment = inject(EnvironmentInjector);
  private targetElementAdded = false;

  constructor() {
    afterNextRender(() => {
      runInInjectionContext(this.environment, () => {
        effect(() => {
          // Track these signals to re-run when they change
          this.bottomMargin();
          this.useWindow();
          this.scrollContainer();

          // Run setup/reinit without tracking internal signal reads/writes
          untracked(() => this.setupInfiniteScroll());
        });
      });
    });
  }

  ngOnDestroy(): void {
    this.observer()?.disconnect();
    this.targetElement()?.remove();
  }

  private setupInfiniteScroll() {
    if (typeof IntersectionObserver === 'undefined') {
      throw new Error('IntersectionObserver is not supported in this browser');
    }

    if (!this.host?.nativeElement) {
      throw new Error('Host element not found');
    }

    if (this.disabled()) return;

    // Only add target element once
    if (!this.targetElementAdded) {
      this.addTargetElement();
      this.targetElementAdded = true;
    }

    this.setScrollParent();

    // Disconnect existing observer before creating new one
    this.observer()?.disconnect();
    this.setupObserver();
  }

  private setupObserver() {
    const target = this.targetElement();
    if (!target) return;

    this.ngZone.runOutsideAngular(() => {
      const rootMargin = `0px 0px ${this.bottomMargin()}% 0px`;
      const options: IntersectionObserverInit = {
        root: this.observerRoot(),
        rootMargin,
        threshold: 0,
      };

      const initDelay = this.initDelay();
      this.observer.set(
        new IntersectionObserver(entries => {
          entries.forEach(entry => {
            if (this.disabled()) return;

            // If checkOnInit is false, ignore intersections within initDelay
            // (e.g. due to scroll restoration after page refresh)
            if (entry.time < initDelay && !this.checkOnInit()) {
              return;
            }

            if (entry.isIntersecting) {
              this.ngZone.run(() => this.emitScroll());
            }
          });
        }, options)
      );

      this.observer()?.observe(target);
    });
  }

  private setScrollParent() {
    if (this.useWindow()) {
      this.observerRoot.set(null);
    } else if (this.scrollContainer()) {
      const el = document.querySelector(this.scrollContainer()!);
      if (!el) {
        throw new Error('Container element not found');
      }
      this.observerRoot.set(el as HTMLElement);
    } else {
      this.observerRoot.set(
        this.findScrollableParent(this.host.nativeElement) ||
          this.host.nativeElement
      );
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
    while (
      node &&
      node !== document.documentElement &&
      node !== document.body
    ) {
      const style = window.getComputedStyle(node);
      const overflowY = style.overflowY;
      const isScrollable =
        overflowY === 'auto' ||
        overflowY === 'scroll' ||
        overflowY === 'overlay';
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
