import {
  inject,
  Injectable,
  Injector,
  signal,
  DOCUMENT,
  DestroyRef,
  PLATFORM_ID,
  NgZone,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { toObservable } from '@angular/core/rxjs-interop';
import { fromEvent, merge, Subject, Subscription, timer } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import {
  DEFAULT_IDLE_OPTIONS,
  IDLE_CONFIG,
  IdleOptions,
} from './idle-provider';

/**
 * Service to detect user inactivity (idle state).
 *
 * @description
 * Monitors DOM events and sets idle state when no activity is detected
 * within the configured timeout period. SSR-safe - does nothing on server.
 *
 * @example
 * ```typescript
 * @Component({...})
 * export class AppComponent {
 *   private idle = inject(IdleService);
 *
 *   constructor() {
 *     this.idle.configure({ timeout: 60000 }); // 1 minute
 *     this.idle.start();
 *
 *     effect(() => {
 *       if (this.idle.isIdle()) {
 *         console.log('User is idle!');
 *       }
 *     });
 *   }
 * }
 * ```
 */
@Injectable()
export class IdleService {
  private readonly document = inject(DOCUMENT);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly injector = inject(Injector);
  private readonly destroyRef = inject(DestroyRef);
  private readonly ngZone = inject(NgZone);

  private readonly _isIdle = signal(false);
  private readonly reset$ = new Subject<void>();

  private timeout: number;
  private events: string[];
  private isRunning = false;
  private subscription: Subscription | null = null;
  private config = inject(IDLE_CONFIG, { optional: true });

  constructor() {
    this.timeout = this.config?.timeout ?? DEFAULT_IDLE_OPTIONS.timeout;
    this.events = this.config?.events ?? DEFAULT_IDLE_OPTIONS.events;

    this.destroyRef.onDestroy(() => this.stop());
  }

  /**
   * Signal indicating whether the user is currently idle.
   */
  readonly isIdle = this._isIdle.asReadonly();

  /**
   * Observable stream of the idle state.
   */
  get isIdle$() {
    return toObservable(this._isIdle, { injector: this.injector });
  }

  /**
   * Configure the idle detection options.
   * If currently running, will restart monitoring with new options.
   * @param options - Configuration options
   */
  configure(options: IdleOptions): void {
    if (options.timeout !== undefined) {
      this.timeout = options.timeout;
    }
    if (options.events !== undefined) {
      this.events = options.events;
    }

    if (this.isRunning) {
      this.stop();
      this.start();
    }
  }

  /**
   * Start monitoring for user activity.
   */
  start(): void {
    if (this.isRunning || !this.isBrowser) {
      return;
    }

    this.isRunning = true;
    this._isIdle.set(false);

    const activityEvents$ = merge(
      ...this.events.map(event =>
        // Use passive for performance
        fromEvent(this.document, event, { passive: true })
      )
    );

    this.ngZone.runOutsideAngular(() => {
      this.subscription = merge(activityEvents$, this.reset$)
        .pipe(
          tap(() => this._isIdle.set(false)),
          switchMap(() => timer(this.timeout))
        )
        .subscribe(() => {
          this._isIdle.set(true);
        });
    });

    this.reset$.next();
  }

  /**
   * Stop monitoring for user activity.
   */
  stop(): void {
    if (!this.isRunning) return;

    this.subscription?.unsubscribe();
    this.subscription = null;

    this.isRunning = false;
    this._isIdle.set(false);
  }

  /**
   * Reset the idle timer. User will be marked as active.
   */
  reset(): void {
    if (this.isRunning) {
      this.reset$.next();
    }
  }
}
