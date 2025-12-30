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
  styleUrl: './press-enter-demo.component.scss',
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
