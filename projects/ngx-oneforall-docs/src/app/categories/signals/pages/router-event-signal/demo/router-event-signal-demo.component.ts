import { ChangeDetectionStrategy, Component } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { routerEventSignal } from '@ngx-oneforall/signals';

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
  styles: [`
    .demo-container {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      padding: 1.5rem;
      background: var(--ng-doc-code-background);
      border-radius: 4px;
    }
    .info, .status, .details {
      padding: 0.5rem;
      background: rgba(0,0,0,0.05);
      border-radius: 4px;
    }
    pre {
      margin: 0.5rem 0 0;
      white-space: pre-wrap;
      word-break: break-all;
      font-size: 0.85rem;
    }
    .hint {
      font-style: italic;
      opacity: 0.7;
      margin: 0;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RouterEventSignalDemoComponent {
  routerSignal = routerEventSignal();
}
