import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { of, throwError, delay, Subject, Observable } from 'rxjs';
import { debug } from '@ngx-oneforall/rxjs';

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
  styles: [
    `
      .demo-container {
        padding: 24px;
        border: 1px solid #e2e8f0;
        border-radius: 12px;
        background: #ffffff;
        font-family:
          'Inter',
          system-ui,
          -apple-system,
          sans-serif;
      }

      h3 {
        margin-top: 0;
        color: #1e293b;
      }
      p {
        color: #64748b;
        margin-bottom: 24px;
      }

      .controls {
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
        margin-bottom: 32px;
      }

      button {
        padding: 10px 20px;
        border: none;
        border-radius: 8px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;
        color: white;
      }

      .btn-next {
        background: #009688;
      }
      .btn-next:hover {
        background: #00796b;
      }

      .btn-error {
        background: #e91e63;
      }
      .btn-error:hover {
        background: #c2185b;
      }

      .btn-complete {
        background: #00bbd4;
      }
      .btn-complete:hover {
        background: #0097a7;
      }

      .toggle-container {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-right: auto;
        padding: 0 12px;
      }

      .toggle-label {
        font-size: 0.875rem;
        color: #475569;
        font-weight: 500;
      }

      .switch {
        position: relative;
        display: inline-block;
        width: 40px;
        height: 22px;
      }

      .switch input {
        opacity: 0;
        width: 0;
        height: 0;
      }

      .slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #cbd5e1;
        transition: 0.4s;
      }

      .slider:before {
        position: absolute;
        content: '';
        height: 16px;
        width: 16px;
        left: 3px;
        bottom: 3px;
        background-color: white;
        transition: 0.4s;
      }

      input:checked + .slider {
        background-color: #00bbd4;
      }

      input:focus + .slider {
        box-shadow: 0 0 1px #00bbd4;
      }

      input:checked + .slider:before {
        transform: translateX(18px);
      }

      .slider.round {
        border-radius: 22px;
      }

      .slider.round:before {
        border-radius: 50%;
      }

      .btn-clear {
        margin-top: 12px;
        background: #f1f5f9;
        color: #64748b;
        font-size: 0.875rem;
      }
      .btn-clear:hover {
        background: #e2e8f0;
      }

      .console-preview {
        background: #1e293b;
        padding: 20px;
        border-radius: 8px;
        color: #f8fafc;
      }

      .console-preview h4 {
        margin-top: 0;
        margin-bottom: 16px;
        color: #94a3b8;
        font-size: 0.75rem;
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }

      .logs {
        display: flex;
        flex-direction: column;
        gap: 8px;
        font-family: 'Fira Code', monospace;
        font-size: 0.8125rem;
        min-height: 100px;
      }

      .log-item {
        padding: 4px 8px;
        border-radius: 4px;
        display: flex;
        gap: 8px;
        align-items: center;
      }

      .tag {
        font-weight: bold;
      }
      .value {
        color: #e2e8f0;
      }

      .placeholder {
        color: #64748b;
        font-style: italic;
      }
    `,
  ],
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
