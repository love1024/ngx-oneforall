import { Component, signal } from '@angular/core';
import { ShortcutDirective } from 'ngx-oneforall/directives/shortcut';

@Component({
  selector: 'shortcut-demo',
  template: `
    <div
      class="demo-container"
      shortcut="ctrl.s, meta.s"
      [isGlobal]="true"
      (action)="onSave()">
      <h3>Global Shortcut</h3>
      <p>
        Press <strong>Ctrl + S</strong> (or Cmd + S) anywhere on the page to
        trigger save.
      </p>

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
        class="demo-input" />

      @if (submitMessage()) {
        <div class="message">
          {{ submitMessage() }}
        </div>
      }
    </div>
  `,
  styleUrl: './shortcut-demo.component.scss',
  imports: [ShortcutDirective],
})
export class ShortcutDemoComponent {
  message = signal<string>('');
  submitMessage = signal<string>('');

  onSave() {
    this.message.set(`Save triggered at ${new Date().toLocaleTimeString()}`);
    setTimeout(() => this.message.set(''), 2000);
  }

  onSubmit() {
    this.submitMessage.set(
      `Submit triggered at ${new Date().toLocaleTimeString()}`
    );
    setTimeout(() => this.submitMessage.set(''), 2000);
  }
}
