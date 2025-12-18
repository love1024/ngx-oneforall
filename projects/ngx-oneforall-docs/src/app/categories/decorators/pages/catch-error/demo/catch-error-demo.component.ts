import { Component, signal } from '@angular/core';
import { CatchError } from '@ngx-oneforall/decorators';
import { CommonModule } from '@angular/common';
import { delay, of, throwError } from 'rxjs';

@Component({
  selector: 'app-catch-error-demo',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="demo-container">
      <h3>CatchError Decorator</h3>
      <p>
        This decorator catches errors in methods and returns a fallback value.
        It supports sync, async (Promise), and Observable methods.
      </p>

      <div class="demo-section">
        <h4>Synchronous Error</h4>
        <div class="controls">
          <button class="btn btn-danger" (click)="triggerSyncError()">
            Trigger Sync Error
          </button>
          <button class="btn btn-outline" (click)="triggerSyncSuccess()">
            Trigger Sync Success
          </button>
        </div>
        <p>
          Result: <span class="badge">{{ syncResult() }}</span>
        </p>
      </div>

      <div class="demo-section">
        <h4>Asynchronous Error (Promise)</h4>
        <div class="controls">
          <button
            class="btn btn-danger"
            (click)="triggerAsyncError()"
            [disabled]="isLoading()">
            {{ isLoading() ? 'Loading...' : 'Trigger Async Error' }}
          </button>
          <button
            class="btn btn-outline"
            (click)="triggerAsyncSuccess()"
            [disabled]="isLoading()">
            {{ isLoading() ? 'Loading...' : 'Trigger Async Success' }}
          </button>
        </div>
        <p>
          Result: <span class="badge">{{ asyncResult() }}</span>
        </p>
      </div>

      <div class="demo-section">
        <h4>Observable Error</h4>
        <div class="controls">
          <button class="btn btn-danger" (click)="triggerObservableError()">
            Trigger Observable Error
          </button>
          <button class="btn btn-outline" (click)="triggerObservableSuccess()">
            Trigger Observable Success
          </button>
        </div>
        <p>
          Result: <span class="badge">{{ observableResult() }}</span>
        </p>
      </div>

      <div class="demo-section">
        <h4>Dynamic Fallback (Function)</h4>
        <p>The fallback returns <code>'Fallback: ' + error.message</code></p>
        <div class="controls">
          <button class="btn btn-primary" (click)="triggerDynamicError()">
            Trigger Dynamic Error
          </button>
        </div>
        <p>
          Result: <span class="badge">{{ dynamicResult() }}</span>
        </p>
      </div>

      <div class="logs">
        <h4>Console Logs (Simulated)</h4>
        <div class="log-output">
          <div *ngFor="let log of logs()" [class]="log.type">
            [{{ log.timestamp }}] {{ log.message }}
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .demo-container {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
        padding: 1.5rem;
        background: #fdfdfd;
        border-radius: 12px;
      }
      .demo-section {
        border: 1px solid #e0e6ed;
        padding: 1.25rem;
        border-radius: 10px;
        background: #ffffff;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
      }
      h4 {
        margin-top: 0;
        margin-bottom: 1rem;
        color: #1a202c;
        font-weight: 600;
      }
      .controls {
        display: flex;
        gap: 0.75rem;
        margin-bottom: 1rem;
      }
      .btn {
        padding: 0.5rem 1rem;
        border-radius: 6px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s ease;
        border: 1px solid transparent;
        font-size: 0.875rem;
      }
      .btn:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }
      .btn-primary {
        background-color: #3182ce;
        color: white;
      }
      .btn-primary:hover:not(:disabled) {
        background-color: #2b6cb0;
        transform: translateY(-1px);
        box-shadow: 0 4px 6px rgba(49, 130, 206, 0.2);
      }
      .btn-danger {
        background-color: #e53e3e;
        color: white;
      }
      .btn-danger:hover:not(:disabled) {
        background-color: #c53030;
        transform: translateY(-1px);
        box-shadow: 0 4px 6px rgba(229, 62, 62, 0.2);
      }
      .btn-outline {
        background-color: transparent;
        border-color: #e2e8f0;
        color: #4a5568;
      }
      .btn-outline:hover:not(:disabled) {
        background-color: #f7fafc;
        border-color: #cbd5e0;
      }
      .badge {
        background: #edf2f7;
        color: #2d3748;
        padding: 0.25rem 0.625rem;
        border-radius: 9999px;
        font-weight: 600;
        font-size: 0.75rem;
        border: 1px solid #e2e8f0;
      }
      .log-output {
        background: #1a202c;
        color: #cbd5e0;
        padding: 1rem;
        height: 180px;
        overflow-y: auto;
        border-radius: 8px;
        font-family: 'JetBrains Mono', 'Fira Code', monospace;
        font-size: 0.8125rem;
        line-height: 1.5;
      }
      .error {
        color: #fc8181;
        font-weight: 500;
      }
      .info {
        color: #68d391;
        font-weight: 500;
      }
    `,
  ],
})
export class CatchErrorDemoComponent {
  syncResult = signal<string | null>(null);
  asyncResult = signal<string | null>(null);
  observableResult = signal<string | null>(null);
  dynamicResult = signal<string | null>(null);
  isLoading = signal(false);
  logs = signal<
    { message: string; type: 'info' | 'error'; timestamp: string }[]
  >([]);

  private addLog(message: string, type: 'info' | 'error' = 'info') {
    const timestamp = new Date().toLocaleTimeString();
    this.logs.update(l => [{ message, type, timestamp }, ...l].slice(0, 10));
  }

  @CatchError('Caught Sync Error!')
  private fallibleSyncMethod(shouldFail: boolean) {
    if (shouldFail) throw new Error('Sync Boom!');
    return 'Sync Success!';
  }

  @CatchError('Caught Async Error!')
  private async fallibleAsyncMethod(shouldFail: boolean) {
    this.isLoading.set(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    this.isLoading.set(false);
    if (shouldFail) throw new Error('Async Boom!');
    return 'Async Success!';
  }

  @CatchError('Caught Observable Error!')
  private fallibleObservableMethod(shouldFail: boolean) {
    if (shouldFail)
      return throwError(() => new Error('Observable Boom!')).pipe(delay(500));
    return of('Observable Success!').pipe(delay(500));
  }

  @CatchError((err: Error) => `Fallback: ${err.message}`)
  private fallibleDynamicMethod(): any {
    throw new Error('Dynamic Boom!');
  }

  triggerSyncError() {
    this.addLog('Calling sync method with failure...');
    const result = this.fallibleSyncMethod(true);
    this.syncResult.set(result as string);
    if (result === 'Caught Sync Error!')
      this.addLog('Error was caught.', 'error');
  }

  triggerSyncSuccess() {
    const result = this.fallibleSyncMethod(false);
    this.syncResult.set(result as string);
    this.addLog('Result: ' + result);
  }

  async triggerAsyncError() {
    this.addLog('Calling async method with failure...');
    const result = await this.fallibleAsyncMethod(true);
    this.asyncResult.set(result as string);
    if (result === 'Caught Async Error!')
      this.addLog('Async error was caught.', 'error');
  }

  async triggerAsyncSuccess() {
    const result = await this.fallibleAsyncMethod(false);
    this.asyncResult.set(result as string);
    this.addLog('Async Result: ' + result);
  }

  triggerObservableError() {
    this.addLog('Calling observable method with failure...');
    this.fallibleObservableMethod(true).subscribe(result => {
      this.observableResult.set(result as string);
      if (result === 'Caught Observable Error!')
        this.addLog('Observable error was caught.', 'error');
    });
  }

  triggerObservableSuccess() {
    this.fallibleObservableMethod(false).subscribe(result => {
      this.observableResult.set(result as string);
      this.addLog('Observable Result: ' + result);
    });
  }

  triggerDynamicError() {
    this.addLog('Calling dynamic fallback method...');
    const result = this.fallibleDynamicMethod();
    this.dynamicResult.set(result as string);
    this.addLog('Result: ' + result, 'error');
  }
}
