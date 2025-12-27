import { Component, signal } from '@angular/core';
import { PressEnterDirective } from '@ngx-oneforall/directives/press-enter';

@Component({
  selector: 'press-enter-demo',
  template: `
    <div class="demo-container">
      <h3>Press Enter Demo</h3>
      <p>Focus the input and press Enter to trigger the event.</p>

      <div class="input-group">
        <input
          type="text"
          placeholder="Type something and press Enter..."
          (pressEnter)="onEnter()"
          #input />
      </div>

      @if (message()) {
        <div class="message">
          {{ message() }}
        </div>
      }
    </div>
  `,
  styles: [
    `
      .demo-container {
        padding: 20px;
        border: 1px solid var(--ng-doc-border-color);
        border-radius: 4px;
      }

      .input-group {
        margin-bottom: 15px;
      }

      input {
        width: 100%;
        padding: 8px 12px;
        border: 1px solid var(--ng-doc-border-color);
        border-radius: 4px;
        background-color: var(--ng-doc-code-bg);
        color: var(--ng-doc-text);
        font-size: 14px;
      }

      input:focus {
        outline: none;
        border-color: var(--ng-doc-primary);
      }

      .message {
        padding: 10px;
        background-color: var(--ng-doc-code-bg);
        border-left: 4px solid var(--ng-doc-primary);
        border-radius: 0 4px 4px 0;
        animation: fadeIn 0.3s ease-in-out;
      }

      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translateY(-5px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    `,
  ],
  imports: [PressEnterDirective],
})
export class PressEnterDemoComponent {
  message = signal<string>('');

  onEnter() {
    this.message.set(`Enter pressed at ${new Date().toLocaleTimeString()}`);

    // Clear message after 2 seconds
    setTimeout(() => {
      this.message.set('');
    }, 2000);
  }
}
