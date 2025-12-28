import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { of, delay, throwError, Observable } from 'rxjs';
import { loadingStatus } from '@ngx-oneforall/rxjs/loading-status';

@Component({
  selector: 'app-loading-status-demo',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="demo-container">
      <h3>Loading Status Demo</h3>
      <p>
        Demonstrate how the operator tracks loading, success, and error states.
      </p>

      <div class="controls">
        <button (click)="loadSuccess()" [disabled]="isLoading()">
          Simulate Success
        </button>
        <button
          (click)="loadError()"
          [disabled]="isLoading()"
          class="error-btn">
          Simulate Error
        </button>
      </div>

      <div
        class="status-box"
        [class.loading]="isLoading()"
        [class.success]="status() === 'success'"
        [class.error]="status() === 'error'">
        @if (isLoading()) {
          <div class="state-container">
            <div class="spinner"></div>
            <span>Loading data...</span>
          </div>
        } @else if (status() === 'success') {
          <div class="result-box">
            <div class="header">
              <label>Status:</label> <span class="badge success">Success</span>
            </div>
            <div class="data-content">
              <strong>Data:</strong>
              <pre>{{ data() | json }}</pre>
            </div>
          </div>
        } @else if (status() === 'error') {
          <div class="result-box">
            <div class="header">
              <label>Status:</label> <span class="badge error">Error</span>
            </div>
            <div class="error-msg">
              <strong>Error:</strong>
              <pre>{{ error() }}</pre>
            </div>
          </div>
        } @else {
          <p class="placeholder">Click a button above to start</p>
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
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      }

      h3 {
        margin-top: 0;
        color: #1e293b;
        font-size: 1.5rem;
      }
      p {
        color: #64748b;
        margin-bottom: 24px;
      }

      .controls {
        display: flex;
        gap: 12px;
        margin-bottom: 24px;
      }

      button {
        padding: 10px 24px;
        border: none;
        border-radius: 8px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s ease;
        background: #3b82f6;
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      button:hover:not(:disabled) {
        background: #2563eb;
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
      }
      button:active:not(:disabled) {
        transform: translateY(0);
      }
      button:disabled {
        background: #cbd5e1;
        cursor: not-allowed;
        opacity: 0.7;
      }

      .error-btn {
        background: #ef4444;
      }
      .error-btn:hover:not(:disabled) {
        background: #dc2626;
        box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
      }

      .status-box {
        padding: 24px;
        border-radius: 12px;
        min-height: 160px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #f8fafc;
        border: 2px dashed #e2e8f0;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }

      .status-box.loading {
        border-color: #3b82f6;
        background: #eff6ff;
      }
      .status-box.success {
        border-style: solid;
        border-color: #22c55e;
        background: #f0fdf4;
      }
      .status-box.error {
        border-style: solid;
        border-color: #ef4444;
        background: #fef2f2;
      }

      .state-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 12px;
        color: #3b82f6;
        font-weight: 500;
      }

      .spinner {
        width: 32px;
        height: 32px;
        border: 3px solid #3b82f6;
        border-top-color: transparent;
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
      }

      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }

      .result-box {
        width: 100%;
        animation: fadeIn 0.3s ease-out;
      }
      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translateY(10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .header {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 16px;
      }
      .header label {
        font-weight: 600;
        color: #475569;
      }

      .badge {
        padding: 4px 12px;
        border-radius: 9999px;
        font-size: 0.75rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.025em;
      }
      .badge.success {
        background: #dcfce7;
        color: #166534;
      }
      .badge.error {
        background: #fee2e2;
        color: #991b1b;
      }

      .data-content,
      .error-msg {
        padding: 16px;
        background: rgba(255, 255, 255, 0.7);
        border-radius: 8px;
        border: 1px solid rgba(0, 0, 0, 0.05);
      }

      pre {
        margin: 8px 0 0;
        font-family: 'Fira Code', 'Cascadia Code', monospace;
        font-size: 0.875rem;
        color: #334155;
      }

      .placeholder {
        color: #94a3b8;
        font-style: italic;
        font-size: 1rem;
      }
    `,
  ],
})
export class LoadingStatusDemoComponent {
  isLoading = signal(false);
  status = signal<'loading' | 'success' | 'error' | null>(null);
  data = signal<any>(null);
  error = signal<any>(null);

  loadSuccess() {
    this.reset();
    this.execute(
      of({
        id: 'REF-1024',
        amount: 299.99,
        currency: 'USD',
        status: 'COMPLETED',
        items: ['Angular Pro License', 'NgDoc Support'],
      }).pipe(delay(1500))
    );
  }

  loadError() {
    this.reset();
    this.execute(
      throwError(
        () => 'Service temporarily unavailable. Please try again later.'
      ).pipe(delay(1500))
    );
  }

  private reset() {
    this.isLoading.set(false);
    this.status.set(null);
    this.data.set(null);
    this.error.set(null);
  }

  private execute(obs: Observable<any>) {
    obs.pipe(loadingStatus()).subscribe(result => {
      this.isLoading.set(result.isLoading);
      this.status.set(result.status);
      this.data.set(result.data);
      this.error.set(result.error);
    });
  }
}
