import {
  inject,
  Injectable,
  DestroyRef,
  PLATFORM_ID,
  computed,
  signal,
} from '@angular/core';
import { isPlatformBrowser, Location } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import {
  HISTORY_CONFIG,
  DEFAULT_HISTORY_OPTIONS,
  HistoryOptions,
} from './history-provider';

/**
 * Service for tracking and managing navigation history within an Angular application.
 *
 * Unlike Angular's Location service which only provides browser history navigation,
 * this service maintains an in-app history stack with additional features like
 * fallback navigation and previous URL tracking.
 *
 * @description
 * Call `startTracking()` to begin tracking route changes. SSR-safe - does nothing on server.
 *
 * @example
 * ```typescript
 * // In AppComponent or app.config.ts
 * const history = inject(HistoryService);
 * history.startTracking();
 *
 * // Later in any component
 * history.backOrFallback('/home');
 * console.log('Came from:', history.previousUrl());
 * ```
 */
@Injectable()
export class HistoryService {
  private readonly router = inject(Router);
  private readonly location = inject(Location);
  private readonly destroyRef = inject(DestroyRef);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly config = inject(HISTORY_CONFIG, { optional: true });

  private readonly maxSize: number;
  private readonly _history = signal<string[]>([]);
  private isTracking = false;

  constructor() {
    const options: Required<HistoryOptions> = {
      ...DEFAULT_HISTORY_OPTIONS,
      ...this.config,
    };
    this.maxSize = options.maxSize;
  }

  /**
   * Signal containing the navigation history stack.
   * Most recent URL is at the end of the array.
   */
  readonly history = this._history.asReadonly();

  /**
   * Signal containing the current URL.
   */
  readonly currentUrl = computed(() => {
    const h = this._history();
    return h.length > 0 ? h[h.length - 1] : null;
  });

  /**
   * Signal containing the previous URL (one before current).
   * Returns `null` if there's no previous URL.
   */
  readonly previousUrl = computed(() => {
    const h = this._history();
    return h.length > 1 ? h[h.length - 2] : null;
  });

  /**
   * Signal indicating whether the user can navigate back.
   */
  readonly canGoBack = computed(() => this._history().length > 1);

  /**
   * Get the number of entries in the history stack.
   */
  readonly length = computed(() => this._history().length);

  /**
   * Navigate back in history. Uses Angular Location.back().
   * Does nothing if there's no history to go back to.
   */
  back(): void {
    if (this.canGoBack()) {
      this.location.back();
    }
  }

  /**
   * Navigate back if possible, otherwise navigate to the fallback URL.
   *
   * @param fallbackUrl - URL to navigate to if there's no history
   */
  backOrFallback(fallbackUrl: string): void {
    if (this.canGoBack()) {
      this.location.back();
    } else {
      this.router.navigateByUrl(fallbackUrl);
    }
  }

  /**
   * Navigate forward in browser history. Uses Angular Location.forward().
   */
  forward(): void {
    this.location.forward();
  }

  /**
   * Navigate to a URL without adding to history (replaces current entry).
   * Useful for redirects (e.g., after login) where you don't want the user
   * to navigate back to the intermediate page.
   *
   * @param url - The URL to navigate to
   * @returns Promise that resolves when navigation is complete
   */
  replaceCurrent(url: string): Promise<boolean> {
    return this.router.navigateByUrl(url, { replaceUrl: true });
  }

  /**
   * Clear the navigation history stack.
   */
  clear(): void {
    this._history.set([]);
  }

  /**
   * Get the full history stack as an array.
   * Most recent URL is at the end.
   */
  getHistory(): string[] {
    return [...this._history()];
  }

  /**
   * Start tracking navigation events.
   * Call this once at app initialization (e.g., in AppComponent).
   * Does nothing if already tracking or on server-side.
   */
  startTracking(): void {
    if (this.isTracking || !this.isBrowser) {
      return;
    }

    this.isTracking = true;
    const initialUrl = this.router.url;
    if (initialUrl) {
      this._history.set([initialUrl]);
    }

    this.router.events
      .pipe(
        filter(
          (event): event is NavigationEnd => event instanceof NavigationEnd
        ),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(event => {
        this._history.update(history => {
          if (history[history.length - 1] === event.urlAfterRedirects) {
            return history;
          }

          const newHistory = [...history, event.urlAfterRedirects];

          if (newHistory.length > this.maxSize) {
            return newHistory.slice(-this.maxSize);
          }

          return newHistory;
        });
      });
  }
}
