import { Component, signal } from '@angular/core';
import { ShortcutDirective } from '@ngx-oneforall/directives';

@Component({
  selector: 'shortcut-demo',
  template: `
    <div class="demo-container" shortcut="ctrl.s, meta.s" [isGlobal]="true" (action)="onSave()">
      <h3>Global Shortcut</h3>
      <p>Press <strong>Ctrl + S</strong> (or Cmd + S) anywhere on the page to trigger save.</p>
      
      @if (message()) {
        <div class="message">
          {{ message() }}
        </div>
      }
    </div>

    <div class="demo-container">
      <h3>Scoped Shortcut</h3>
      <p>Focus the input and press <strong>Shift + Enter</strong> to submit.</p>
      <input 
        type="text" 
        placeholder="Focus me and press Shift + Enter" 
        shortcut="shift.enter" 
        (action)="onSubmit()"
        class="demo-input"
      />
      
      @if (submitMessage()) {
        <div class="message">
          {{ submitMessage() }}
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

    .demo-input {
      width: 100%;
      padding: 8px;
      margin-top: 10px;
      border: 1px solid var(--ng-doc-border-color);
      border-radius: 4px;
      background: var(--ng-doc-code-bg);
      color: var(--ng-doc-text-color);
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
  imports: [ShortcutDirective]
})
export class ShortcutDemoComponent {
  message = signal<string>('');
  submitMessage = signal<string>('');

  onSave() {
    this.message.set(`Save triggered at ${new Date().toLocaleTimeString()}`);
    setTimeout(() => this.message.set(''), 2000);
  }

  onSubmit() {
    this.submitMessage.set(`Submit triggered at ${new Date().toLocaleTimeString()}`);
    setTimeout(() => this.submitMessage.set(''), 2000);
  }
}
