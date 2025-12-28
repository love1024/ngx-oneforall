import { Component } from '@angular/core';
import {
  provideTimeAgoPipeClock,
  TimeAgoPipe,
} from '@ngx-oneforall/pipes/time-ago';
import { timer } from 'rxjs';

@Component({
  selector: 'lib-time-ago-custom-clock-demo',
  imports: [TimeAgoPipe],
  template: `
    <h2>Time Ago Pipe - Custom Clock</h2>
    <h4>The clock will update every 5 seconds.</h4>
    <p>Current time: {{ now | timeAgo }}</p>
  `,
  providers: [
    provideTimeAgoPipeClock(() => {
      return timer(5000);
    }),
  ],
  styleUrl: './time-ago-custom-clock-demo.component.scss',
})
export class TimeAgoCustomClockDemoComponent {
  now = new Date(); // Example date
}
