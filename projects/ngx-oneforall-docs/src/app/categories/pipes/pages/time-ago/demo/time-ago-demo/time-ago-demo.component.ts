import { Component } from '@angular/core';
import { TimeAgoPipe } from 'ngx-oneforall/pipes/time-ago';

@Component({
  selector: 'lib-time-ago-demo',
  imports: [TimeAgoPipe],
  template: `
    <div class="demo-container">
      <h3>Past Dates</h3>
      <div class="demo-row">
        <span>Just now ({{ now.toLocaleTimeString() }}):</span>
        <strong>{{ now | timeAgo }}</strong>
      </div>
      <div class="demo-row">
        <span>5 minutes ago:</span>
        <strong>{{ fiveMinutesAgo | timeAgo }}</strong>
      </div>
      <div class="demo-row">
        <span>2 hours ago:</span>
        <strong>{{ twoHoursAgo | timeAgo }}</strong>
      </div>
      <div class="demo-row">
        <span>Yesterday:</span>
        <strong>{{ yesterday | timeAgo }}</strong>
      </div>

      <h3>Future Dates</h3>
      <div class="demo-row">
        <span>In 30 minutes:</span>
        <strong>{{ inThirtyMinutes | timeAgo }}</strong>
      </div>
      <div class="demo-row">
        <span>Tomorrow:</span>
        <strong>{{ tomorrow | timeAgo }}</strong>
      </div>

      <h3>Static (no live updates)</h3>
      <div class="demo-row">
        <span>5 minutes ago (static):</span>
        <strong>{{ fiveMinutesAgo | timeAgo: false }}</strong>
      </div>
    </div>
  `,
  styleUrl: './time-ago-demo.component.scss',
})
export class TimeAgoDemoComponent {
  now = new Date();
  fiveMinutesAgo = new Date(this.now.getTime() - 5 * 60 * 1000);
  twoHoursAgo = new Date(this.now.getTime() - 2 * 60 * 60 * 1000);
  yesterday = new Date(this.now.getTime() - 24 * 60 * 60 * 1000);
  inThirtyMinutes = new Date(this.now.getTime() + 30 * 60 * 1000);
  tomorrow = new Date(this.now.getTime() + 24 * 60 * 60 * 1000);
}
