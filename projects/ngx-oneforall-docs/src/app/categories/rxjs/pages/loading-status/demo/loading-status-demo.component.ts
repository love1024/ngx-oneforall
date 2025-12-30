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
  styleUrl: './loading-status-demo.component.scss',
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
