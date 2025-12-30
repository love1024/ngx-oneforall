import { ChangeDetectionStrategy, Component } from '@angular/core';
import { intervalSignal } from 'ngx-oneforall/signals/interval-signal';

@Component({
  selector: 'interval-signal-demo',
  standalone: true,
  template: `
    <div class="demo-container">
      <div class="counter">Count: {{ interval.value() }}</div>

      <div class="controls">
        <button (click)="interval.start()" [disabled]="interval.running()">
          Start
        </button>
        <button (click)="interval.stop()" [disabled]="!interval.running()">
          Stop
        </button>
      </div>

      <div class="status">
        Status: {{ interval.running() ? 'Running' : 'Stopped' }}
      </div>
    </div>
  `,
  styleUrl: './interval-signal-demo.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IntervalSignalDemoComponent {
  interval = intervalSignal(1000);
}
