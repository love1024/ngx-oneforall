import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { useCache } from '@ngx-oneforall/interceptors/cache';

interface Todo {
  title: string;
  completed: boolean;
}

@Component({
  selector: 'lib-cache-interceptor-service',
  template: `
    <div class="container">
      <button class="fetch-btn" (click)="fetchTodos()">
        Load Todos with Cache
      </button>
      <p>
        Todos will be cached for 5 seconds. You will not see any network call
        for 5 seconds even if you click again.
      </p>
      @if (todos().length === 0) {
        <div class="empty-msg">
          No todos loaded. Click the button above to fetch data.
        </div>
      }

      @if (todos().length > 0) {
        <ul class="todo-list">
          @for (todo of todos(); track todo.title) {
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
  styleUrls: ['./cache-interceptor-service.scss'],
  providers: [],
})
export class CacheInterceptorServiceComponent {
  private readonly http = inject(HttpClient);
  todos = signal<Todo[]>([]);

  fetchTodos() {
    this.http
      .get<Todo[]>('https://jsonplaceholder.typicode.com/todos', {
        context: useCache({ ttl: 5000 }),
      })
      .subscribe(res => {
        this.todos.set(res.slice(0, 5));
      });
  }
}
