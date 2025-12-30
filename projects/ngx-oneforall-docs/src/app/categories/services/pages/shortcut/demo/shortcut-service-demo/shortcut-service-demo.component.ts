import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import {
  provideShortcutService,
  ShortcutService,
} from 'ngx-oneforall/services/shortcut';

@Component({
  selector: 'shortcut-service-demo',
  template: `
    <div class="demo-container">
      <h3>Service Demo</h3>
      <p>
        Press <strong>Shift + S</strong> to trigger a service-based shortcut.
      </p>

      @if (message()) {
        <div class="message">
          {{ message() }}
        </div>
      }
    </div>
  `,
  styleUrl: './shortcut-service-demo.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  providers: [provideShortcutService()],
})
export class ShortcutServiceDemoComponent {
  private shortcutService = inject(ShortcutService);
  message = signal('');

  constructor() {
    this.shortcutService
      .observe({ key: 'shift.s', isGlobal: true })
      .subscribe(() => {
        this.message.set('Shift + S triggered via ShortcutService!');
        setTimeout(() => this.message.set(''), 2000);
      });
  }
}
