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
  styleUrl: './query-param-demo.component.scss',
})
export class QueryParamDemoComponent {
  protected route = inject(ActivatedRoute);
}
