import { inject, LOCALE_ID, Pipe, PipeTransform } from '@angular/core';

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

    return secondsPassed + '';
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
