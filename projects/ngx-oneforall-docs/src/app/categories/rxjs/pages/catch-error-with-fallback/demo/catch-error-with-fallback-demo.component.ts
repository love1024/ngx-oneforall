import { Component, signal } from '@angular/core';
import { catchErrorWithFallback } from '@ngx-oneforall/rxjs/catch-error-with-fallback';
import { of, throwError, delay } from 'rxjs';

interface LogEntry {
  id: number;
  type: 'success' | 'error' | 'fallback';
  message: string;
  timestamp: Date;
}

@Component({
  selector: 'lib-catch-error-with-fallback-demo',
  template: `
    <div class="container">
      <h3>catchErrorWithFallback Operator Demo</h3>
      <p class="description">
        The <code>catchErrorWithFallback</code> operator provides a clean way to
        handle errors with various fallback strategies: static values,
        observables, or factory functions.
      </p>

      <div class="actions">
        <button class="btn success" (click)="successfulRequest()">
          Successful Request
        </button>
        <button class="btn fallback-static" (click)="errorWithStaticFallback()">
          Error → Static Fallback
        </button>
        <button
          class="btn fallback-observable"
          (click)="errorWithObservableFallback()">
          Error → Observable Fallback
        </button>
        <button
          class="btn fallback-function"
          (click)="errorWithFunctionFallback()">
          Error → Function Fallback
        </button>
        <button class="btn clear" (click)="clearLogs()">Clear Logs</button>
      </div>

      @if (logs().length > 0) {
        <div class="logs-container">
          <h4>Event Log</h4>
          <div class="logs-list">
            @for (log of logs(); track log.id) {
              <div class="log-entry" [class]="log.type">
                <div class="log-header">
                  <span class="log-type">{{ log.type.toUpperCase() }}</span>
                  <span class="log-time">{{ formatTime(log.timestamp) }}</span>
                </div>
                <div class="log-message">{{ log.message }}</div>
              </div>
            }
          </div>
        </div>
      } @else {
        <div class="empty-state">
          No events yet. Click a button above to see the operator in action.
        </div>
      }
    </div>
  `,
  styleUrls: ['./catch-error-with-fallback-demo.component.scss'],
})
export class CatchErrorWithFallbackDemoComponent {
  logs = signal<LogEntry[]>([]);
  private logId = 1;

  successfulRequest() {
    of('Data loaded successfully')
      .pipe(
        delay(100),
        catchErrorWithFallback<string>('Fallback data', {
          onError: err => this.addLog('error', `Error caught: ${err}`),
        })
      )
      .subscribe(data => {
        this.addLog('success', data);
      });
  }

  errorWithStaticFallback() {
    throwError(() => new Error('Network error'))
      .pipe(
        catchErrorWithFallback('Default fallback value', {
          onError: (err: any) => this.addLog('error', `Error: ${err.message}`),
        })
      )
      .subscribe(data => {
        this.addLog('fallback', `Received fallback: ${data}`);
      });
  }

  errorWithObservableFallback() {
    throwError(() => new Error('API error'))
      .pipe(
        catchErrorWithFallback(of('Fallback from observable').pipe(delay(50)), {
          onError: (err: any) => this.addLog('error', `Error: ${err.message}`),
        })
      )
      .subscribe(data => {
        this.addLog('fallback', `Received fallback: ${data}`);
      });
  }

  errorWithFunctionFallback() {
    throwError(() => new Error('Custom error'))
      .pipe(
        catchErrorWithFallback(
          (err: any) => `Generated fallback for: ${err.message}`,
          {
            onError: (err: any) =>
              this.addLog('error', `Error: ${err.message}`),
          }
        )
      )
      .subscribe(data => {
        this.addLog('fallback', `Received: ${data}`);
      });
  }

  clearLogs() {
    this.logs.set([]);
    this.logId = 1;
  }

  formatTime(date: Date): string {
    return date.toLocaleTimeString();
  }

  private addLog(type: LogEntry['type'], message: string) {
    this.logs.update(logs => [
      {
        id: this.logId++,
        type,
        message,
        timestamp: new Date(),
      },
      ...logs,
    ]);
  }
}
