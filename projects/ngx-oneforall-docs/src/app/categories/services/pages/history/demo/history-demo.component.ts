import { Component, inject } from '@angular/core';
import { HistoryService } from 'ngx-oneforall/services/history';

@Component({
  selector: 'lib-history-demo',
  template: `
    <div class="demo-container">
      <h2>History Service Demo</h2>

      <div class="info-section">
        <div class="info-row">
          <span class="label">Current URL:</span>
          <code>{{ history.currentUrl() ?? 'null' }}</code>
        </div>
        <div class="info-row">
          <span class="label">Previous URL:</span>
          <code>{{ history.previousUrl() ?? 'null' }}</code>
        </div>
        <div class="info-row">
          <span class="label">History Length:</span>
          <code>{{ history.length() }}</code>
        </div>
        <div class="info-row">
          <span class="label">Can Go Back:</span>
          <code>{{ history.canGoBack() }}</code>
        </div>
      </div>

      <div class="button-group">
        <button
          (click)="history.back()"
          [disabled]="!history.canGoBack()"
          class="btn">
          Back
        </button>
        <button (click)="history.backOrFallback('/docs')" class="btn">
          Back or Fallback
        </button>
        <button (click)="history.clear()" class="btn btn-danger">
          Clear History
        </button>
      </div>

      <div class="history-stack">
        <h3>History Stack</h3>
        <ol>
          @for (url of history.getHistory(); track url; let i = $index) {
            <li [class.current]="i === history.length() - 1">
              <code>{{ url }}</code>
            </li>
          } @empty {
            <li class="empty">No history entries</li>
          }
        </ol>
      </div>
    </div>
  `,
  styleUrl: 'history-demo.component.scss',
  // providers: [provideHistoryService()] Provided at the root level for demo
})
export class HistoryDemoComponent {
  readonly history = inject(HistoryService);
}
