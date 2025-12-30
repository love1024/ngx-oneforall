import { ChangeDetectionStrategy, Component } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { routerEventSignal } from 'ngx-oneforall/signals/router-event-signal';

@Component({
  selector: 'router-event-signal-demo',
  standalone: true,
  imports: [JsonPipe],
  template: `
    <div class="demo-container">
      <div class="info">
        <strong>Current Event:</strong>
        <pre>{{ routerSignal.event()?.constructor?.name || 'None' }}</pre>
      </div>

      <div class="status">
        <div>Is Navigation Start: {{ routerSignal.isNavigationStart() }}</div>
        <div>Is Navigation End: {{ routerSignal.isNavigationEnd() }}</div>
      </div>

      <div class="details">
        <strong>Event Details:</strong>
        <pre>{{ routerSignal.event() | json }}</pre>
      </div>

      <p class="hint">Click on the right menu links to see updates!</p>
    </div>
  `,
  styleUrl: './router-event-signal-demo.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RouterEventSignalDemoComponent {
  routerSignal = routerEventSignal();
}
