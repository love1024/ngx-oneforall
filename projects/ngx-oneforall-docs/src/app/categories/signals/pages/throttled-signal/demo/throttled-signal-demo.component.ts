import { Component, signal } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { throttledSignal } from '@ngx-oneforall/signals/throttled-signal';

@Component({
  selector: 'app-throttled-signal-demo',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="demo-container">
      <div class="input-group">
        <label>Move your mouse over this area:</label>
        <div class="mouse-area" (mousemove)="updateCoordinates($event)">
          Move Here
        </div>
      </div>

      <div class="results">
        <p><strong>Actual Coordinates:</strong> {{ coords() }}</p>
        <p><strong>Throttled (500ms):</strong> {{ throttledCoords() }}</p>
      </div>
    </div>
  `,
  styleUrl: './throttled-signal-demo.component.scss',
})
export class ThrottledSignalDemoComponent {
  coords = signal('0, 0');
  throttledCoords = throttledSignal(this.coords, 500);

  updateCoordinates(event: MouseEvent) {
    this.coords.set(`${event.offsetX}, ${event.offsetY}`);
  }
}
