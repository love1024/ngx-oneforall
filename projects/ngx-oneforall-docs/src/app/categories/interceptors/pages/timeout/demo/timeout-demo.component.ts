import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { withTimeout } from '@ngx-oneforall/interceptors';
import { NgClass } from '@angular/common';

@Component({
  selector: 'lib-timeout-demo',
  standalone: true,
  imports: [NgClass],
  template: `
    <div class="timeout-container">
      <div class="controls">
        <div class="control-group">
          <label>Global Timeout (set in config): 5000ms</label>
        </div>
        <div class="button-group">
          <button class="demo-btn success" (click)="fetchFast()">
            Fetch Fast (No Delay)
          </button>
          <button class="demo-btn warning" (click)="fetchSlow()">
            Fetch Slow (6s Delay) - Should Timeout
          </button>
          <button class="demo-btn info" (click)="fetchCustom()">
            Fetch Slow (6s Delay) with 8s Context Override - Should Success
          </button>
        </div>
      </div>

      <div class="results">
        @if (loading()) {
          <div class="loading-spinner">Requesting...</div>
        }

        @if (status()) {
          <div class="status-box" [ngClass]="statusType()">
            <strong>Status: {{ status() }}</strong>
            <p>{{ message() }}</p>
          </div>
        }
      </div>
    </div>
  `,
  styleUrls: ['./timeout-demo.scss'],
})
export class TimeoutInterceptorDemoComponent {
  private readonly http = inject(HttpClient);

  loading = signal(false);
  status = signal<string | null>(null);
  message = signal<string | null>(null);
  statusType = signal<'success' | 'error' | 'info'>('success');

  fetchFast() {
    this.executeRequest(
      'https://jsonplaceholder.typicode.com/todos/1',
      'Fast Request'
    );
  }

  fetchSlow() {
    this.executeRequest(
      'https://httpbin.org/delay/6',
      'Slow Request (6s delay)'
    );
  }

  fetchCustom() {
    this.executeRequest(
      'https://httpbin.org/delay/6',
      'Slow Request with Override',
      { context: withTimeout({ timeout: 8000 }) }
    );
  }

  private executeRequest(url: string, label: string, options: any = {}) {
    this.loading.set(true);
    this.status.set(null);
    this.message.set(null);

    this.http.get(url, options).subscribe({
      next: res => {
        this.loading.set(false);
        this.status.set(`${label} - Success`);
        this.statusType.set('success');
        this.message.set('The request completed within the timeout period.');
      },
      error: err => {
        this.loading.set(false);
        this.status.set(`${label} - Error`);
        this.statusType.set('error');
        if (err.name === 'TimeoutError') {
          this.message.set(err.message);
        } else {
          this.message.set('An error occurred, but it was not a timeout.');
        }
      },
    });
  }
}
