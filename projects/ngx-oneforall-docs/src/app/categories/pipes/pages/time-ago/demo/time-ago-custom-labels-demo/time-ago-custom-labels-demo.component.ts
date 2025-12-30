import { Component } from '@angular/core';
import {
  provideTimeAgoPipeLabels,
  TimeAgoLabels,
  TimeAgoPipe,
} from 'ngx-oneforall/pipes/time-ago';

@Component({
  selector: 'lib-time-ago-custom-labels-demo',
  imports: [TimeAgoPipe],
  template: `
    <h2>Time Ago Pipe - Custom Labels</h2>
    <p>Current time: {{ now | timeAgo }}</p>
  `,
  providers: [
    provideTimeAgoPipeLabels(() => {
      return {
        prefix: '',
        suffix: 'ago',
        second: 'sec',
        seconds: 'secs',
        minute: 'min',
        minutes: 'mins',
        hour: 'hr',
        hours: 'hrs',
        day: 'day',
        days: 'days',
        week: 'wk',
        weeks: 'wks',
        month: 'mo',
        months: 'mos',
        year: 'yr',
        years: 'yrs',
      } as TimeAgoLabels;
    }),
  ],
  styleUrl: './time-ago-custom-labels-demo.component.scss',
})
export class TimeAgoCustomLabelsDemoComponent {
  now = new Date(); // Example date
}
