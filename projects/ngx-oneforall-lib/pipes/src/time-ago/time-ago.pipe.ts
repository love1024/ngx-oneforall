import { inject, LOCALE_ID, Pipe, PipeTransform } from '@angular/core';
import { DAY, HOUR, MINUTE, MONTH, WEEK, YEAR } from './time-ago.util';

@Pipe({
  name: 'timeAgo',
})
export class TimeAgoPipe implements PipeTransform {
  private readonly locale = inject(LOCALE_ID);

  transform(value: string | Date, locale: string): string {
    if (!locale) {
      locale = this.locale;
    }

    const timestamp = this.getTimestamp(value);
    const now = Date.now();

    const secondsPassed = Math.floor((now - timestamp) / 1000);
    const labels = this.getTimeAgoLabels();

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

  private getTimestamp(value: string | Date): number {
    if (typeof value === 'string') {
      return new Date(value).getTime();
    } else if (value instanceof Date) {
      return value.getTime();
    } else {
      throw new Error('Invalid date format');
    }
  }

  private getTimeAgoLabels() {
    return {
      seconds: 'seconds ago',
      minutes: 'minutes ago',
      hours: 'hours ago',
      days: 'days ago',
      weeks: 'weeks ago',
      months: 'months ago',
      years: 'years ago',
    };
  }
}
