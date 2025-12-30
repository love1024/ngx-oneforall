import { Component, signal } from '@angular/core';
import { ClickOutsideDirective } from 'ngx-oneforall/directives/click-outside';

@Component({
  selector: 'lib-click-outside-demo',
  imports: [ClickOutsideDirective],
  template: `
    <div (clickOutside)="clickedOutside()">Click outside this area</div>
    <p>You have clicked {{ clickedCount() }} times outside</p>
  `,
  styleUrl: './click-outside-demo.component.scss',
})
export class ClickOutsideDemoComponent {
  clickedCount = signal(0);

  clickedOutside() {
    this.clickedCount.update(v => v + 1);
  }
}
