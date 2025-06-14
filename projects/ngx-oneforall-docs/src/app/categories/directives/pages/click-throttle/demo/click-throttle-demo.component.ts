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
  styles: `
    .throttle-demo-container {
      max-width: 400px;
      margin: 2rem auto;
      padding: 2rem;
      border-radius: 8px;
      background: #f9f9f9;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
      font-family: 'Segoe UI', Arial, sans-serif;
    }
    .throttle-demo-container h2 {
      margin-bottom: 1rem;
      color: #1976d2;
    }
    .throttle-slider {
      margin: 1.5rem 0;
    }
    .throttle-slider label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
    }
    .throttle-btn {
      background: #1976d2;
      color: #fff;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 4px;
      font-size: 1rem;
      cursor: pointer;
      transition: background 0.2s;
    }
    .throttle-btn:hover {
      background: #1565c0;
    }
    .count-display {
      margin-top: 1.5rem;
      font-size: 1.1rem;
    }
    .count-display strong {
      color: #388e3c;
      margin-left: 0.5rem;
    }
  `,
})
export class ClickThrottleDemoComponent {
  count = signal(0);
  time = signal(2000);

  onThrottledClick() {
    this.count.update(c => c + 1);
  }
}
