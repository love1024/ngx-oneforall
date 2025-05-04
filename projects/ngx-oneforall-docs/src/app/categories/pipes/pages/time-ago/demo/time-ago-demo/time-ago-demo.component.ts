import { Component } from '@angular/core';
import { TimeAgoPipe } from '@ngx-oneforall/pipes';

@Component({
  selector: 'lib-time-ago-demo',
  imports: [TimeAgoPipe],
  template: ` {{ now | timeAgo: 'en' }} `,
  styleUrl: './time-ago-demo.component.scss',
})
export class TimeAgoDemoComponent {
  now = new Date(2023, 10, 1, 12, 0, 0); // Example date
}
