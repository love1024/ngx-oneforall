import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { cache, cacheInterceptor } from '@ngx-oneforall/interceptors';
import { provideCacheService } from '@ngx-oneforall/services';

interface Todo {
  title: string;
  completed: boolean;
}

@Component({
  selector: 'lib-cache-interceptor-service',
  imports: [],
  template: `
    <button (click)="fetchTodos()">Fetch Todos</button>
    @for (todo of todos(); track todo.title) {
      <span>{{ todo.title }}</span
      >&nbsp;<span>{{ todo.completed }}</span>
      <br />
    }
  `,
  styles: ``,
  providers: [],
})
export class CacheInterceptorServiceComponent {
  private readonly http = inject(HttpClient);
  todos = signal<Todo[]>([]);

  fetchTodos() {
    this.http
      .get<Todo[]>('https://jsonplaceholder.typicode.com/todos', {
        context: cache({ ttl: 5000 }),
      })
      .subscribe(res => {
        this.todos.set(res.slice(0, 10));
      });
  }
}
