import { JsonPipe } from '@angular/common';
import { Component, signal } from '@angular/core';
import { Cache, CachedMethod } from 'ngx-oneforall/decorators/cache';
import { Observable, of, delay } from 'rxjs';

interface Response {
  data: string;
  timestamp: Date;
}

@Component({
  imports: [JsonPipe],
  selector: 'lib-cache-decorator-demo',
  template: `
    <div class="cache-demo-container">
      <h2>Cache Decorator Demo</h2>
      <p>
        This demo demonstrates the <code>Cache</code> decorator in action. The
        method below simulates a data fetch with a delay, but repeated calls
        with the same parameter are served instantly from cache within
        <strong>5 seconds</strong>.
      </p>
      <div class="button-group">
        <button (click)="fetchData('Angular')" [disabled]="isLoading()">
          Fetch "Angular"
        </button>
        <button (click)="fetchData('RxJS')" [disabled]="isLoading()">
          Fetch "RxJS"
        </button>
        <button (click)="invalidate()">Invalidate Cache</button>
      </div>

      @if (isLoading()) {
        <div class="status loading">⏳ Loading...</div>
      }

      @if (result()) {
        <div class="result-box">
          <div class="header">
            <h3>Result:</h3>
            <span
              class="badge"
              [class.cache]="source() === 'Cache'"
              [class.server]="source() === 'Server'">
              Source: {{ source() }}
            </span>
            <span class="time">Time: {{ timeTaken() }}ms</span>
          </div>
          <pre>{{ result() | json }}</pre>
        </div>
      }

      <div class="note">
        <strong>Note:</strong> Try clicking the same button multiple times. Then
        click "Invalidate Cache" and click "Fetch" again to see the delay.
      </div>
    </div>
  `,
  styleUrl: 'cache-decorator-demo.component.scss',
})
export class CacheDecoratorComponent {
  result = signal<Response | null>(null);
  isLoading = signal(false);
  source = signal<'Server' | 'Cache' | null>(null);
  timeTaken = signal(0);

  @Cache({ ttl: 5000, maxItems: 5 })
  fetchFromServer(query: string): Observable<Response> {
    // Simulate a slow HTTP request
    return of({
      data: `Fetched result for "${query}"`,
      timestamp: new Date(),
    }).pipe(delay(1500));
  }

  fetchData(query: string) {
    this.result.set(null);
    this.isLoading.set(true);
    const start = performance.now();

    this.fetchFromServer(query).subscribe(res => {
      const end = performance.now();
      const duration = Math.round(end - start);

      this.timeTaken.set(duration);
      // Heuristic: if it took less than 100ms (and we have a 1500ms delay), it's from cache
      this.source.set(duration < 100 ? 'Cache' : 'Server');

      this.result.set(res);
      this.isLoading.set(false);
    });
  }

  invalidate() {
    (this.fetchFromServer as unknown as CachedMethod).clearCache();
    // Don't clear result, so user can fetch again and see the difference
    this.result.set(null);
    this.source.set(null);
  }
}
