import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'lib-param-demo',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="demo-container">
      <h3>Param Guard Demo</h3>
      <p>Current Params: {{ route.params | async | json }}</p>

      <div class="buttons">
        <p>
          <em
            >Note: This guard typically protects routes like
            <code>/users/:id</code>. Below links simulate navigation
            concepts.</em
          >
        </p>
      </div>

      <p class="note">
        Usage:
        <code>paramGuard({{ '{' }} required: ['id'] {{ '}' }})</code> ensures
        <code>:id</code> is present in the route parameters.
      </p>
    </div>
  `,
  styleUrl: './param-demo.component.scss',
})
export class ParamDemoComponent {
  protected route = inject(ActivatedRoute);
}
