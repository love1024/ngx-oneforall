import { Component, signal } from '@angular/core';
import {
  VisibilityChange,
  VisibilityChangeDirective,
} from '@ngx-oneforall/directives';

@Component({
  selector: 'lib-visibility-change-demo',
  imports: [VisibilityChangeDirective],
  template: `
    @if (show()) {
      <div (visibilityChange)="visibilityChange($event)"></div>
    }

    <button (click)="hide()">Hide</button>
  `,
  styleUrl: './visibility-change-demo.component.scss',
})
export class VisibilityChangeDemoComponent {
  show = signal(true);

  hide() {
    this.show.set(false);
  }

  visibilityChange(e: VisibilityChange) {
    console.log(e);
  }
}
