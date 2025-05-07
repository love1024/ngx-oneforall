import { Component } from '@angular/core';
import {
  TIME_AGO_PIPE_CLOCK,
  TIME_AGO_PIPE_LABELS,
  TimeAgoPipe,
  TimeAgoLabels,
} from '@ngx-oneforall/pipes';
import { timer } from 'rxjs';

@Component({
  selector: 'lib-time-ago-demo',
  imports: [TimeAgoPipe],
  template: ` {{ now | timeAgo }} `,
  styleUrl: './time-ago-demo.component.scss',
  providers: [
    {
      provide: TIME_AGO_PIPE_CLOCK,
      useValue: {
        tick: () => {
          return timer(5000);
        },
      },
    },
    {
      provide: TIME_AGO_PIPE_LABELS,
      useValue: {
        suffix: 'passed',
        second: 'second',
        minute: 'minute',
        minutes: 'minutes',
        hour: 'hour',
        day: 'day',
        week: 'week',
        month: 'month',
        year: 'year',
      } as TimeAgoLabels,
    },
  ],
})
export class TimeAgoDemoComponent {
  now = new Date(); // Example date
}
