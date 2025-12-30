import { Component, signal } from '@angular/core';
import { RepeatDirective } from 'ngx-oneforall/directives/repeat';

@Component({
  selector: 'lib-repeat-demo',
  standalone: true,
  imports: [RepeatDirective],
  template: `
    <div class="repeat-demo-container">
      <h2>Repeat Directive Demo</h2>
      <p
        *repeat="count(); let i = index; let isFirst = first; let isLast = last"
        class="box">
        <span class="index-label">Item #{{ i + 1 }}</span>
        @if (isFirst) {
          <span class="badge first">First item</span>
        } @else if (isLast) {
          <span class="badge last">Last item</span>
        }
      </p>
    </div>
  `,
  styleUrl: 'repeat-demo.component.scss',
})
export class RepeatDemoComponent {
  count = signal(5);
}
