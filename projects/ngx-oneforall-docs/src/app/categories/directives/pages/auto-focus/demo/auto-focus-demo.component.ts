import { Component, signal } from '@angular/core';
import { AutoFocusDirective } from 'ngx-oneforall/directives/auto-focus';

@Component({
  selector: 'lib-auto-focus-demo',
  imports: [AutoFocusDirective],
  template: `
    <div class="demo-section">
      <label for="noFocus">Without auto focus</label>
      <input id="noFocus" class="no-focus" type="text" />
    </div>

    <div class="demo-section">
      <label for="autoFocus">With auto focus</label>
      <input id="autoFocus" class="auto-focus" type="text" autoFocus />
    </div>

    <div class="demo-section">
      <label for="manualFocus">Focus manually</label>
      <input
        id="manualFocus"
        class="auto-focus-click"
        type="text"
        autoFocus
        [isFocused]="isFocused()" />
      <button class="focus-button" (click)="focus()">Click to Focus</button>
    </div>
  `,
  styleUrl: 'auto-focus-demo.component.scss',
})
export class AutoFocusDemoComponent {
  isFocused = signal(false);

  focus() {
    this.isFocused.set(true);
  }
}
