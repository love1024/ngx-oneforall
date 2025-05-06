import { Component } from '@angular/core';
import { TimeAgoPipe } from '@ngx-oneforall/pipes';

@Component({
  selector: 'lib-time-ago-demo',
  imports: [TimeAgoPipe],
  template: ` {{ now | timeAgo }} `,
  styleUrl: './time-ago-demo.component.scss',
})
export class TimeAgoDemoComponent {
  now = new Date(); // Example date
}
