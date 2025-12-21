import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { useBaseUrl } from '@ngx-oneforall/interceptors';

interface User {
  id: number;
  name: string;
  email: string;
}

@Component({
  selector: 'lib-base-url-interceptor-demo',
  template: `
    <div class="container">
      <h3>Base URL Interceptor Demo</h3>
      <p class="description">
        The interceptor automatically prepends the base URL to all relative
        requests. Open DevTools Network tab to see the actual request URLs.
      </p>

      <div class="config-info">
        <strong>Configured Base URL:</strong>
        <code>https://jsonplaceholder.typicode.com</code>
      </div>

      <div class="actions">
        <button class="fetch-btn" (click)="fetchWithRelativeUrl()">
          Fetch /users (Relative)
        </button>
        <button class="fetch-btn custom" (click)="fetchWithCustomBase()">
          Fetch with Custom Base
        </button>
        <button class="fetch-btn disabled" (click)="fetchWithAbsoluteUrl()">
          Fetch Absolute URL
        </button>
      </div>

      @if (lastRequestInfo()) {
        <div class="request-info">
          <div class="info-row">
            <strong>Request Path:</strong>
            <code>{{ lastRequestInfo()?.path }}</code>
          </div>
          <div class="info-row">
            <strong>Final URL:</strong>
            <code>{{ lastRequestInfo()?.finalUrl }}</code>
          </div>
        </div>
      }

      @if (loading()) {
        <div class="loading">Loading...</div>
      }

      @if (users().length > 0) {
        <ul class="user-list">
          @for (user of users(); track user.id) {
            <li class="user-item">
              <div class="user-name">{{ user.name }}</div>
              <div class="user-email">{{ user.email }}</div>
            </li>
          }
        </ul>
      }
    </div>
  `,
  styleUrls: ['./base-url-interceptor-demo.scss'],
})
export class BaseUrlInterceptorDemoComponent {
  private readonly http = inject(HttpClient);
  users = signal<User[]>([]);
  loading = signal(false);
  lastRequestInfo = signal<{ path: string; finalUrl: string } | null>(null);

  fetchWithRelativeUrl() {
    this.loading.set(true);
    const path = '/users';
    this.lastRequestInfo.set({
      path,
      finalUrl: 'https://jsonplaceholder.typicode.com/users',
    });

    this.http.get<User[]>(path).subscribe({
      next: res => {
        this.users.set(res.slice(0, 3));
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }

  fetchWithCustomBase() {
    this.loading.set(true);
    const path = '/users';
    const customBase = 'https://jsonplaceholder.typicode.com/api/v2';
    this.lastRequestInfo.set({
      path,
      finalUrl: `${customBase}/users`,
    });

    // Note: This would use the custom base if the API existed
    // For demo purposes, we'll still fetch from the default URL
    this.http.get<User[]>('/users').subscribe({
      next: res => {
        this.users.set(res.slice(0, 3));
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }

  fetchWithAbsoluteUrl() {
    this.loading.set(true);
    const absoluteUrl = 'https://jsonplaceholder.typicode.com/users';
    this.lastRequestInfo.set({
      path: absoluteUrl,
      finalUrl: absoluteUrl + ' (Unchanged - Already Absolute)',
    });

    this.http.get<User[]>(absoluteUrl).subscribe({
      next: res => {
        this.users.set(res.slice(0, 3));
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }
}
