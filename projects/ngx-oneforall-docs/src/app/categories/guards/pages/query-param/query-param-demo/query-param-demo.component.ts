import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'lib-query-param-demo',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="demo-container">
      <h3>Query Param Guard Demo</h3>
      <p>Current Query Params: {{ route.queryParams | async | json }}</p>

      <div class="buttons">
        <a
          routerLink="."
          [queryParams]="{ id: '123', type: 'admin' }"
          class="btn">
          Navigate with Valid Params (id & type)
        </a>
        <a routerLink="." [queryParams]="{ id: '123' }" class="btn">
          Navigate with Missing 'type' (predicate fail)
        </a>
        <a routerLink="." [queryParams]="{ type: 'admin' }" class="btn">
          Navigate with Missing 'id' (required fail)
        </a>
        <a routerLink="." [queryParams]="{}" class="btn">
          Navigate without Params (fail)
        </a>
      </div>

      <p class="note">
        Note: The guard logic is: <code>required: ['id']</code> and
        <code>predicate: params => params['type'] === 'admin'</code>. If the
        guard fails, it redirects back to this page (simulated here since the
        guard is applied to this route in docs).
      </p>
    </div>
  `,
  styles: [
    `
      .demo-container {
        padding: 1rem;
        border: 1px solid #ccc;
        border-radius: 8px;
      }
      .buttons {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        margin-top: 1rem;
      }
      .btn {
        padding: 0.5rem 1rem;
        background-color: #007bff;
        color: white;
        text-decoration: none;
        border-radius: 4px;
        font-size: 0.9rem;
      }
      .btn:hover {
        background-color: #0056b3;
      }
      .note {
        margin-top: 1rem;
        font-size: 0.85rem;
        color: #666;
      }
      code {
        background-color: #f8f9fa;
        padding: 0.2rem 0.4rem;
        border-radius: 3px;
      }
    `,
  ],
})
export class QueryParamDemoComponent {
  protected route = inject(ActivatedRoute);
}
