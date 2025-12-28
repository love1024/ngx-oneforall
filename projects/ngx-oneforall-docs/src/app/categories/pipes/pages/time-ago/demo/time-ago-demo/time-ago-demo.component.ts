import { Component } from '@angular/core';
import { TimeAgoPipe } from '@ngx-oneforall/pipes/time-ago';

@Component({
  selector: 'lib-time-ago-demo',
  imports: [TimeAgoPipe],
  template: `
    <h2>Time Ago Pipe Demo</h2>
    <p>Current time: {{ now | timeAgo }}</p>
  `,
  styleUrl: './time-ago-demo.component.scss',
})
export class TimeAgoDemoComponent {
  now = new Date(); // Example date
}
