import { Component, signal } from '@angular/core';
import { ShowForDirective } from 'ngx-oneforall/directives/show-for';

@Component({
  selector: 'lib-show-for-demo',
  standalone: true,
  imports: [ShowForDirective],
  template: `
    <div class="show-for-demo-container">
      <h2>Show For Directive Demo</h2>

      <div *showFor="duration(); then expiredTpl" class="banner">
        ⏳ This message will disappear in {{ duration() / 1000 }}s...
      </div>

      <ng-template #expiredTpl>
        <div class="banner expired">
          ✅ Timer expired! Click reset to see it again.
        </div>
      </ng-template>

      <button class="reset-btn" (click)="reset()">Reset</button>
    </div>
  `,
  styleUrl: 'show-for-demo.component.scss',
})
export class ShowForDemoComponent {
  duration = signal(3000);

  reset() {
    const current = this.duration();
    this.duration.set(0);
    setTimeout(() => this.duration.set(current));
  }
}
