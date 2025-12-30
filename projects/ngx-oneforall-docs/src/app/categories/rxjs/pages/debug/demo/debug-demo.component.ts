import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { of, throwError, delay, Subject, Observable } from 'rxjs';
import { debug } from '@ngx-oneforall/rxjs/debug';

@Component({
  selector: 'app-debug-demo',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="demo-container">
      <h3>Debug Operator Demo</h3>
      <p>
        The <code>debug</code> operator prints styled logs to your browser's
        console. Open your browser's developer tools (F12 or Cmd+Option+I) to
        see the results.
      </p>

      <div class="controls">
        <div class="toggle-container">
          <label class="switch">
            <input
              type="checkbox"
              [checked]="isLoggingEnabled()"
              (change)="toggleLogging()" />
            <span class="slider round"></span>
          </label>
          <span class="toggle-label"
            >Logging {{ isLoggingEnabled() ? 'Enabled' : 'Disabled' }}</span
          >
        </div>

        <button (click)="triggerNext()" class="btn-next">
          Trigger Next Event
        </button>
        <button (click)="triggerError()" class="btn-error">
          Trigger Error Event
        </button>
        <button (click)="triggerComplete()" class="btn-complete">
          Trigger Complete Event
        </button>
      </div>

      <div class="console-preview">
        <h4>Console Preview (Simulation)</h4>
        <div class="logs">
          @for (log of logs(); track $index) {
            <div class="log-item" [style.background]="log.bg">
              <span class="tag">[{{ log.tag }}: {{ log.type }}]</span>
              @if (log.value) {
                <span class="value">{{ log.value | json }}</span>
              }
            </div>
          }
          @if (logs().length === 0) {
            <p class="placeholder">
              Click buttons above and check your browser console!
            </p>
          }
        </div>
        @if (logs().length > 0) {
          <button (click)="clearLogs()" class="btn-clear">Clear Logs</button>
        }
      </div>
    </div>
  `,
  styleUrl: './debug-demo.component.scss',
})
export class DebugDemoComponent {
  logs = signal<any[]>([]);
  isLoggingEnabled = signal(true);
  private trigger$ = new Subject<any>();

  constructor() {
    this.trigger$
      .pipe(debug('DemoOperator', () => this.isLoggingEnabled()))
      .subscribe();
  }

  toggleLogging() {
    this.isLoggingEnabled.update(v => !v);
  }

  triggerNext() {
    const val = {
      id: Math.floor(Math.random() * 1000),
      timestamp: new Date().toISOString(),
    };
    if (this.isLoggingEnabled()) {
      this.addLog('DemoOperator', 'Next', '#00bbd4ff', val);
    }
    this.trigger$.next(val);
  }

  triggerError() {
    const err = 'Simulated error in stream';
    if (this.isLoggingEnabled()) {
      this.addLog('DemoOperator', 'Error', '#E91E63', err);
      console.log(
        '%c[DemoOperator: Error]',
        'background: #E91E63; color: #fff; padding: 3px; font-size: 9px;',
        err
      );
    }
    // Be careful not to kill the demo trigger subject
  }

  triggerComplete() {
    if (this.isLoggingEnabled()) {
      this.addLog('DemoOperator', 'Complete', '#009688');
      console.log(
        '%c[DemoOperator]: Complete',
        'background:  #009688; color: #fff; padding: 3px; font-size: 9px;'
      );
    }
  }

  private addLog(tag: string, type: string, bg: string, value?: any) {
    this.logs.set([...this.logs(), { tag, type, bg, value: value ?? null }]);
  }

  clearLogs() {
    this.logs.set([]);
  }
}
