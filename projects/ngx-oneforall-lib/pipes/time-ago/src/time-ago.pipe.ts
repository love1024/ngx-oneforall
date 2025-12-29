import {
  ChangeDetectorRef,
  DestroyRef,
  inject,
  Pipe,
  PipeTransform,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  DAY,
  defaultClock,
  defaultLabels,
  getSecondsPassed,
  HOUR,
  mergeLabels,
  MINUTE,
  MONTH,
  TimeAgoLabels,
  Unit,
  WEEK,
  YEAR,
} from './time-ago.util';
import { Subscription } from 'rxjs';
import {
  TIME_AGO_PIPE_CLOCK,
  TIME_AGO_PIPE_LABELS,
} from './time-ago.providers';

/**
 * Transforms a date into a human-readable relative time string.
 * Supports past dates ("2 hours ago"), future dates ("in 2 hours"),
 * and "just now" for very recent times.
 *
 * @usageNotes
 * ```html
 * {{ createdAt | timeAgo }}        → "2 hours ago"
 * {{ futureDate | timeAgo }}       → "in 3 days"
 * {{ createdAt | timeAgo:false }}  → Static, no live updates
 * ```
 */
@Pipe({
  name: 'timeAgo',
  pure: false,
})
export class TimeAgoPipe implements PipeTransform {
  private readonly cd = inject(ChangeDetectorRef);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly clock =
    inject(TIME_AGO_PIPE_CLOCK, { optional: true }) ?? defaultClock;
  private readonly labels =
    inject(TIME_AGO_PIPE_LABELS, { optional: true }) ?? defaultLabels;
  private readonly destroyRef = inject(DestroyRef);
  private clockSubscription: Subscription | null = null;

  /**
   * Transforms a date into a relative time string.
   *
   * @param value - Date string or Date object
   * @param live - If true, updates automatically (default: true)
   * @returns Human-readable relative time string
   */
  transform(value: string | Date, live = true): string {
    const timestamp = this.getTimestamp(value);
    const secondsPassed = getSecondsPassed(timestamp);

    // Skip live updates on server to prevent SSR timeout
    if (live && isPlatformBrowser(this.platformId)) {
      this.startUpdateTimer(timestamp);
    }

    return this.constructResponse(secondsPassed);
  }

  private startUpdateTimer(then: number) {
    if (this.clockSubscription) {
      this.clockSubscription.unsubscribe();
      this.clockSubscription = null;
    }
    this.clockSubscription = this.clock
      .tick(then)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.cd.markForCheck();
      });
  }

  private constructResponse(secondsPassed: number): string {
    const labels = mergeLabels(this.labels);
    const isFuture = secondsPassed < 0;
    const absSeconds = Math.abs(secondsPassed);

    // Handle "just now" for recent times (within 10 seconds)
    if (absSeconds < 10) {
      return labels.justNow!;
    }

    const [value, unit] = this.parseTimeUnit(absSeconds);
    const unitLabel =
      value > 1 ? labels[(unit + 's') as keyof TimeAgoLabels] : labels[unit];

    if (isFuture) {
      return `${labels.futurePrefix} ${value} ${unitLabel} ${labels.futureSuffix}`.trim();
    }
    return `${labels.prefix} ${value} ${unitLabel} ${labels.suffix}`.trim();
  }

  private parseTimeUnit(absSeconds: number): [number, Unit] {
    if (absSeconds < MINUTE) {
      return [absSeconds, Unit.SECOND];
    } else if (absSeconds < HOUR) {
      return [Math.floor(absSeconds / MINUTE), Unit.MINUTE];
    } else if (absSeconds < DAY) {
      return [Math.floor(absSeconds / HOUR), Unit.HOUR];
    } else if (absSeconds < WEEK) {
      return [Math.floor(absSeconds / DAY), Unit.DAY];
    } else if (absSeconds < MONTH) {
      return [Math.floor(absSeconds / WEEK), Unit.WEEK];
    } else if (absSeconds < YEAR) {
      return [Math.floor(absSeconds / MONTH), Unit.MONTH];
    } else {
      return [Math.floor(absSeconds / YEAR), Unit.YEAR];
    }
  }

  private getTimestamp(value: string | Date): number {
    if (typeof value === 'string' && !isNaN(Date.parse(value))) {
      return new Date(value).getTime();
    } else if (value instanceof Date) {
      return value.getTime();
    } else {
      throw new Error('Invalid date format');
    }
  }
}
