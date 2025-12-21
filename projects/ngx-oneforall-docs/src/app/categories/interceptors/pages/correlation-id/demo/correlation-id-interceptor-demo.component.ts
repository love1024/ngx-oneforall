import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { useCorrelationId } from '@ngx-oneforall/interceptors';

interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

@Component({
  selector: 'lib-correlation-id-interceptor-demo',
  template: `
    <div class="container">
      <h3>Correlation ID Interceptor Demo</h3>
      <p class="description">
        Each request automatically gets a unique correlation ID header for
        tracking and debugging. Open DevTools Network tab to see the
        <code>X-Correlation-Id</code> header in action.
      </p>

      <div class="actions">
        <button class="fetch-btn" (click)="fetchWithDefault()">
          Fetch with Auto ID
        </button>
        <button class="fetch-btn custom" (click)="fetchWithCustomId()">
          Fetch with Custom ID
        </button>
        <button class="fetch-btn disabled" (click)="fetchWithoutId()">
          Fetch without ID
        </button>
      </div>

      @if (lastCorrelationId()) {
        <div class="correlation-info">
          <strong>Last Correlation ID:</strong>
          <code>{{ lastCorrelationId() }}</code>
        </div>
      }

      @if (loading()) {
        <div class="loading">Loading...</div>
      }

      @if (todos().length > 0) {
        <ul class="todo-list">
          @for (todo of todos(); track todo.id) {
            <li class="todo-item">
              <span class="todo-title">{{ todo.title }}</span>
              <span class="todo-status" [class.completed]="todo.completed">
                {{ todo.completed ? '✔️ Completed' : '❌ Pending' }}
              </span>
            </li>
          }
        </ul>
      }
    </div>
  `,
  styleUrls: ['./correlation-id-interceptor-demo.scss'],
})
export class CorrelationIdInterceptorDemoComponent {
  private readonly http = inject(HttpClient);
  todos = signal<Todo[]>([]);
  loading = signal(false);
  lastCorrelationId = signal<string>('');

  fetchWithDefault() {
    this.loading.set(true);
    const correlationId = crypto.randomUUID();
    this.lastCorrelationId.set(correlationId + ' (Generated automatically)');

    this.http
      .get<Todo[]>('https://jsonplaceholder.typicode.com/todos')
      .subscribe({
        next: res => {
          this.todos.set(res.slice(0, 3));
          this.loading.set(false);
        },
        error: () => {
          this.loading.set(false);
        },
      });
  }

  fetchWithCustomId() {
    this.loading.set(true);
    const customId = 'custom-id-' + Date.now();
    this.lastCorrelationId.set(customId + ' (Custom)');

    this.http
      .get<Todo[]>('https://jsonplaceholder.typicode.com/todos', {
        context: useCorrelationId({ id: customId }),
      })
      .subscribe({
        next: res => {
          this.todos.set(res.slice(0, 3));
          this.loading.set(false);
        },
        error: () => {
          this.loading.set(false);
        },
      });
  }

  fetchWithoutId() {
    this.loading.set(true);
    this.lastCorrelationId.set('None (Disabled via context)');

    this.http
      .get<Todo[]>('https://jsonplaceholder.typicode.com/todos', {
        context: useCorrelationId({ enabled: false }),
      })
      .subscribe({
        next: res => {
          this.todos.set(res.slice(0, 3));
          this.loading.set(false);
        },
        error: () => {
          this.loading.set(false);
        },
      });
  }
}
