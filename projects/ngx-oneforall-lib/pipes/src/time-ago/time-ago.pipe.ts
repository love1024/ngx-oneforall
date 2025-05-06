import {
  ChangeDetectorRef,
  inject,
  InjectionToken,
  Pipe,
  PipeTransform,
} from '@angular/core';
import {
  DAY,
  getSecondsPassed,
  HOUR,
  MINUTE,
  MONTH,
  WEEK,
  YEAR,
} from './time-ago.util';
import { Subscription, timer } from 'rxjs';

export const TIME_AGO_PIPE_CLOCK = new InjectionToken('TIME_AGO_PIPE_CLOCK', {
  providedIn: 'root',
  factory: () => {
    return {
      tick: (then: number) => {
        const secondsPassed = getSecondsPassed(then);
        let interval = 0;

        if (secondsPassed < MINUTE) {
          interval = 1000;
        } else if (secondsPassed < HOUR) {
          interval = MINUTE * 1000;
        } else if (secondsPassed < DAY) {
          interval = HOUR * 1000;
        }

        return timer(interval);
      },
    };
  },
});

export const TIME_AGO_PIPE_LABELS = new InjectionToken('TIME_AGO_PIPE_LABELS', {
  providedIn: 'root',
  factory: () => {
    return {
      seconds: 'seconds ago',
      minutes: 'minutes ago',
      hours: 'hours ago',
      days: 'days ago',
      weeks: 'weeks ago',
      months: 'months ago',
      years: 'years ago',
    };
  },
});

@Pipe({
  name: 'timeAgo',
  pure: false,
})
export class TimeAgoPipe implements PipeTransform {
  private readonly cd = inject(ChangeDetectorRef);
  private readonly clock = inject(TIME_AGO_PIPE_CLOCK);
  private readonly labels = inject(TIME_AGO_PIPE_LABELS);
  private clockSubscription: Subscription | null = null;

  transform(value: string | Date): string {
    const timestamp = this.getTimestamp(value);

    const secondsPassed = getSecondsPassed(timestamp);

    this.startInterval(timestamp);

    return this.constructResponse(secondsPassed);
  }

  private startInterval(then: number) {
    if (this.clockSubscription) {
      this.clockSubscription.unsubscribe();
      this.clockSubscription = null;
    }
    this.clockSubscription = this.clock.tick(then).subscribe(() => {
      this.cd.markForCheck();
    });
  }

  private getTimestamp(value: string | Date): number {
    if (typeof value === 'string') {
      return new Date(value).getTime();
    } else if (value instanceof Date) {
      return value.getTime();
    } else {
      throw new Error('Invalid date format');
    }
  }

  private constructResponse(secondsPassed: number): string {
    const labels = this.labels;

    if (secondsPassed < MINUTE) {
      return `${secondsPassed} ${labels.seconds}`;
    } else if (secondsPassed < HOUR) {
      return `${Math.floor(secondsPassed / MINUTE)} ${labels.minutes}`;
    } else if (secondsPassed < DAY) {
      return `${Math.floor(secondsPassed / HOUR)} ${labels.hours}`;
    } else if (secondsPassed < WEEK) {
      return `${Math.floor(secondsPassed / DAY)} ${labels.days}`;
    } else if (secondsPassed < MONTH) {
      return `${Math.floor(secondsPassed / WEEK)} ${labels.weeks}`;
    } else if (secondsPassed < YEAR) {
      return `${Math.floor(secondsPassed / MONTH)} ${labels.months}`;
    } else {
      return `${Math.floor(secondsPassed / YEAR)} ${labels.years}`;
    }
  }
}
