import { ChangeDetectionStrategy, Component } from '@angular/core';
import { intervalSignal } from '@ngx-oneforall/signals';

@Component({
    selector: 'interval-signal-demo',
    standalone: true,
    template: `
    <div class="demo-container">
      <div class="counter">
        Count: {{ interval.value() }}
      </div>
      
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
    styles: [`
    .demo-container {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      align-items: center;
      padding: 2rem;
      background: var(--ng-doc-code-background);
      border-radius: 4px;
    }
    .counter {
      font-size: 2rem;
      font-weight: bold;
    }
    .controls {
      display: flex;
      gap: 1rem;
    }
    button {
      padding: 0.5rem 1rem;
      background: var(--ng-doc-primary);
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  `],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IntervalSignalDemoComponent {
    interval = intervalSignal(1000);
}
