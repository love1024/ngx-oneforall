import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import {
  usePerformance,
  PerformanceEntry,
} from '@ngx-oneforall/interceptors/performance';

interface Post {
  id: number;
  title: string;
  body: string;
}

@Component({
  selector: 'lib-performance-interceptor-demo',
  template: `
    <div class="container">
      <h3>Performance Interceptor Demo</h3>
      <p class="description">
        The interceptor automatically measures and reports HTTP request
        performance. Watch the performance metrics update in real-time below.
      </p>

      <div class="actions">
        <button class="fetch-btn" (click)="fetchPosts()">Fetch Posts</button>
        <button class="fetch-btn labeled" (click)="fetchWithLabel()">
          Fetch with Label
        </button>
        <button class="fetch-btn error" (click)="fetchError()">
          Trigger Error
        </button>
        <button class="clear-btn" (click)="clearMetrics()">
          Clear Metrics
        </button>
      </div>

      @if (performanceMetrics().length > 0) {
        <div class="metrics-container">
          <h4>Performance Metrics</h4>
          <div class="metrics-list">
            @for (metric of performanceMetrics(); track $index) {
              <div
                class="metric-card"
                [class.error]="(metric.status ?? 0) >= 400">
                <div class="metric-row">
                  <strong>Method:</strong>
                  <span>{{ metric.method }}</span>
                </div>
                <div class="metric-row">
                  <strong>URL:</strong>
                  <span class="url">{{ metric.url }}</span>
                </div>
                <div class="metric-row">
                  <strong>Duration:</strong>
                  <span class="duration"
                    >{{ metric.durationMs.toFixed(2) }} ms</span
                  >
                </div>
                <div class="metric-row">
                  <strong>Status:</strong>
                  <span
                    [class.success]="(metric.status ?? 0) < 400"
                    [class.error-status]="(metric.status ?? 0) >= 400">
                    {{ metric.status ?? 'N/A' }}
                  </span>
                </div>
                @if (metric.label) {
                  <div class="metric-row">
                    <strong>Label:</strong>
                    <span class="label">{{ metric.label }}</span>
                  </div>
                }
              </div>
            }
          </div>
        </div>
      } @else {
        <div class="empty-state">
          No performance metrics yet. Make a request to see metrics appear here.
        </div>
      }
    </div>
  `,
  styleUrls: ['./performance-interceptor-demo.scss'],
})
export class PerformanceInterceptorDemoComponent {
  private readonly http = inject(HttpClient);
  performanceMetrics = signal<PerformanceEntry[]>([]);

  private customReporter = (entry: PerformanceEntry) => {
    this.performanceMetrics.update(metrics => [entry, ...metrics]);
  };

  fetchPosts() {
    // Note: In a real app, the interceptor would be configured globally
    // For this demo, we're simulating the behavior
    const start = performance.now();

    this.http
      .get<Post[]>('https://jsonplaceholder.typicode.com/posts')
      .subscribe({
        next: () => {
          this.customReporter({
            url: 'https://jsonplaceholder.typicode.com/posts',
            method: 'GET',
            durationMs: performance.now() - start,
            status: 200,
          });
        },
      });
  }

  fetchWithLabel() {
    const start = performance.now();

    this.http
      .get<Post[]>('https://jsonplaceholder.typicode.com/posts', {
        context: usePerformance({ label: 'Labeled Request' }),
      })
      .subscribe({
        next: () => {
          this.customReporter({
            url: 'https://jsonplaceholder.typicode.com/posts',
            method: 'GET',
            durationMs: performance.now() - start,
            status: 200,
            label: 'Labeled Request',
          });
        },
      });
  }

  fetchError() {
    const start = performance.now();

    this.http
      .get('https://jsonplaceholder.typicode.com/invalid-endpoint')
      .subscribe({
        error: () => {
          this.customReporter({
            url: 'https://jsonplaceholder.typicode.com/invalid-endpoint',
            method: 'GET',
            durationMs: performance.now() - start,
            status: 404,
          });
        },
      });
  }

  clearMetrics() {
    this.performanceMetrics.set([]);
  }
}
