import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ClickThrottleDirective } from '@ngx-oneforall/directives';

@Component({
  selector: 'lib-click-throttle-demo',
  standalone: true,
  imports: [ClickThrottleDirective, FormsModule],
  template: `
    <div class="throttle-demo-container">
      <h2>Click Throttle Example</h2>
      <p>
        You can only register a click every
        <strong>{{ time() / 1000 }}</strong> seconds. Any additional clicks
        within this interval will be ignored.
      </p>
      <div class="throttle-slider">
        <label for="throttleTime"
          >Throttle Interval (ms): <strong>{{ time() }}</strong></label
        >
        <input
          type="range"
          id="throttleTime"
          min="500"
          max="5000"
          step="100"
          [(ngModel)]="time" />
      </div>
      <button
        class="throttle-btn"
        type="button"
        [throttleTime]="time()"
        (clickThrottle)="onThrottledClick()">
        Throttled Click
      </button>
      <p class="count-display">
        <span>Accepted Clicks:</span>
        <strong>{{ count() }}</strong>
      </p>
    </div>
  `,
  styleUrl: 'click-throttle-demo.component.scss',
})
export class ClickThrottleDemoComponent {
  count = signal(0);
  time = signal(2000);

  onThrottledClick() {
    this.count.update(c => c + 1);
  }
}
