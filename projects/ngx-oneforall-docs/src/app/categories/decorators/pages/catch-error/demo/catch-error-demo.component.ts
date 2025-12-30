import { Component, signal } from '@angular/core';
import { CatchError } from 'ngx-oneforall/decorators/catch-error';

import { delay, of, throwError } from 'rxjs';

@Component({
  selector: 'app-catch-error-demo',
  standalone: true,
  imports: [],
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
          @for (log of logs(); track log) {
            <div [class]="log.type">
              [{{ log.timestamp }}] {{ log.message }}
            </div>
          }
        </div>
      </div>
    </div>
  `,
  styleUrl: './catch-error-demo.component.scss',
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
