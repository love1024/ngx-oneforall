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
  styleUrl: 'cache-decorator-demo.component.scss',
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
