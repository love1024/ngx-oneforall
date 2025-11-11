import { JsonPipe } from '@angular/common';
import { Component, signal } from '@angular/core';
import { Cache } from '@ngx-oneforall/decorators';
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
      <button (click)="fetchData('Angular')">Fetch "Angular"</button>
      <button (click)="fetchData('RxJS')">Fetch "RxJS"</button>
      <button (click)="clear()">Clear Results</button>
      @if (result()) {
        <h3>Result:</h3>
        <pre>{{ result() | json }}</pre>
      }

      <div class="note">
        <strong>Note:</strong> Try clicking the same button multiple times to
        see caching in effect!
      </div>
    </div>
  `,
  styles: [
    `
      .cache-demo-container {
        max-width: 500px;
        margin: 2rem auto;
        padding: 2rem;
        border-radius: 8px;
        background: #f9f9f9;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
      }
      button {
        margin-right: 1rem;
        margin-bottom: 1rem;
        padding: 0.5rem 1.5rem;
        border: none;
        border-radius: 4px;
        background: #1976d2;
        color: #fff;
        cursor: pointer;
        transition: background 0.2s;
      }
      button:hover {
        background: #1565c0;
      }
      pre {
        background: #272822;
        color: #f8f8f2;
        padding: 1rem;
        border-radius: 4px;
        overflow-x: auto;
      }
      .note {
        margin-top: 1.5rem;
        font-size: 0.95em;
        color: #555;
      }
    `,
  ],
})
export class CacheDecoratorComponent {
  result = signal<Response | null>(null);

  @Cache({ ttl: 5000, maxItems: 5 })
  fetchFromServer(query: string): Observable<Response> {
    // Simulate a slow HTTP request
    return of({
      data: `Fetched result for "${query}"`,
      timestamp: new Date(),
    }).pipe(delay(1500));
  }

  fetchData(query: string) {
    this.fetchFromServer(query).subscribe(res => this.result.set(res));
  }

  clear() {
    this.result.set(null);
  }
}
