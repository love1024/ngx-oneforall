import { DatePipe, JsonPipe } from '@angular/common';
import { Component, signal } from '@angular/core';
import { memoize } from '@ngx-oneforall/decorators/memoize';
import { Observable, of, delay } from 'rxjs';

interface Response {
  data: string;
  timestamp: Date;
}

@Component({
  imports: [JsonPipe, DatePipe],
  selector: 'lib-memoize-decorator-demo',
  template: `
    <div class="memoize-demo-container">
      <h2>Memoize Decorator Demo</h2>
      <p>
        This demo demonstrates the <code>memoize</code> decorator. The method
        below simulates a heavy computation or API call. Repeated calls with the
        same arguments return the cached result instantly.
      </p>

      <div class="controls">
        <button (click)="calculate(50)">Calculate Factorial(50)</button>
        <button (click)="calculate(100)">Calculate Factorial(100)</button>
        <button (click)="fetchAsync('User1')">Fetch User1 (Async)</button>
        <button (click)="fetchAsync('User2')">Fetch User2 (Async)</button>
        <button (click)="clear()">Clear Results</button>
      </div>

      @if (result()) {
        <div class="result-box">
          <h3>Result:</h3>
          <pre>{{ result() | json }}</pre>
          <p class="timestamp">
            Computed at: {{ result()?.timestamp | date: 'mediumTime' }}
          </p>
        </div>
      }

      <div class="logs">
        <h3>Execution Logs:</h3>
        <ul>
          @for (log of logs(); track $index) {
            <li>{{ log }}</li>
          }
        </ul>
      </div>

      <div class="note">
        <strong>Note:</strong> Click the same button twice. The first time
        you'll see "Computing..." log, the second time it returns instantly
        without logging "Computing...".
      </div>
    </div>
  `,
  styleUrl: 'memoize-decorator-demo.component.scss',
})
export class MemoizeDecoratorComponent {
  result = signal<Response | null>(null);
  logs = signal<string[]>([]);

  @memoize()
  computeFactorial(n: number): number {
    this.addLog(`Computing factorial for ${n}... (Expensive Operation)`);
    if (n === 0 || n === 1) return 1;
    return n * this.computeFactorialRecursive(n - 1);
  }

  // Helper for recursion to avoid logging on every recursive step if we don't want to
  private computeFactorialRecursive(n: number): number {
    if (n === 0 || n === 1) return 1;
    return n * this.computeFactorialRecursive(n - 1);
  }

  @memoize()
  fetchDataAsync(id: string): Promise<string> {
    this.addLog(`Fetching data for ${id}... (Async Operation)`);
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(`Data for ${id}`);
      }, 2000);
    });
  }

  calculate(n: number) {
    this.addLog(`Requesting factorial(${n})...`);
    const start = performance.now();
    const value = this.computeFactorial(n);
    const end = performance.now();

    this.result.set({
      data: `Factorial(${n}) = ${value}`,
      timestamp: new Date(),
    });

    this.addLog(`Result received in ${(end - start).toFixed(2)}ms`);
  }

  async fetchAsync(id: string) {
    this.addLog(`Requesting async data for ${id}...`);
    const start = performance.now();
    const value = await this.fetchDataAsync(id);
    const end = performance.now();

    this.result.set({
      data: value,
      timestamp: new Date(),
    });

    this.addLog(`Async result received in ${(end - start).toFixed(2)}ms`);
  }

  addLog(message: string) {
    this.logs.update(logs => [
      ...logs,
      `[${new Date().toLocaleTimeString()}] ${message}`,
    ]);
  }

  clear() {
    this.result.set(null);
    this.logs.set([]);
  }
}
