import { ChangeDetectorRef, inject, Pipe, PipeTransform } from '@angular/core';
import {
  DAY,
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

@Pipe({
  name: 'timeAgo',
  pure: false,
})
export class TimeAgoPipe implements PipeTransform {
  private readonly cd = inject(ChangeDetectorRef);
  private readonly clock = inject(TIME_AGO_PIPE_CLOCK);
  private readonly labels = inject(TIME_AGO_PIPE_LABELS);
  private clockSubscription: Subscription | null = null;

  transform(value: string | Date, live = true): string {
    const timestamp = this.getTimestamp(value);

    const secondsPassed = getSecondsPassed(timestamp);

    if (live) {
      this.startInterval(timestamp);
    }

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

  private constructResponse(secondsPassed: number): string {
    const labels = mergeLabels(this.labels);

    let parsed: [number, Unit];
    if (secondsPassed < MINUTE) {
      parsed = [secondsPassed, Unit.SECOND];
    } else if (secondsPassed < HOUR) {
      parsed = [Math.floor(secondsPassed / MINUTE), Unit.MINUTE];
    } else if (secondsPassed < DAY) {
      parsed = [Math.floor(secondsPassed / HOUR), Unit.HOUR];
    } else if (secondsPassed < WEEK) {
      parsed = [Math.floor(secondsPassed / DAY), Unit.DAY];
    } else if (secondsPassed < MONTH) {
      parsed = [Math.floor(secondsPassed / WEEK), Unit.WEEK];
    } else if (secondsPassed < YEAR) {
      parsed = [Math.floor(secondsPassed / MONTH), Unit.MONTH];
    } else {
      parsed = [Math.floor(secondsPassed / YEAR), Unit.YEAR];
    }

    const [value, label] = parsed;
    const response =
      value > 1
        ? `${labels.prefix} ${value} ${labels[(label + 's') as keyof TimeAgoLabels]} ${labels.suffix}`
        : `${labels.prefix} ${value} ${labels[label]} ${labels.suffix}`;

    return response.trim();
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
}
