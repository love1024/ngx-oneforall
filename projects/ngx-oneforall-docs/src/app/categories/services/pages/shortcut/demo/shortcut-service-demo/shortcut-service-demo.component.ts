import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { provideShortcutService, ShortcutService } from '@ngx-oneforall/services';

@Component({
  selector: 'shortcut-service-demo',
  template: `
    <div class="demo-container">
      <h3>Service Demo</h3>
      <p>Press <strong>Ctrl + S</strong> to trigger a service-based shortcut.</p>
      
      @if (message()) {
        <div class="message">
          {{ message() }}
        </div>
      }
    </div>
  `,
  styles: [`
    .demo-container {
      padding: 20px;
      border: 1px solid var(--ng-doc-border-color);
      border-radius: 4px;
      margin-bottom: 20px;
    }

    .message {
      margin-top: 10px;
      padding: 10px;
      background-color: var(--ng-doc-code-bg);
      border-left: 4px solid var(--ng-doc-primary);
      border-radius: 0 4px 4px 0;
      animation: fadeIn 0.3s ease-in-out;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(-5px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  providers: [provideShortcutService()]
})
export class ShortcutServiceDemoComponent {
  private shortcutService = inject(ShortcutService);
  message = signal('');

  constructor() {
    this.shortcutService.observe({ key: 'ctrl.s', isGlobal: true }).subscribe(() => {
      this.message.set('Ctrl + S triggered via ShortcutService!');
      setTimeout(() => this.message.set(''), 2000);
    });
  }
}
