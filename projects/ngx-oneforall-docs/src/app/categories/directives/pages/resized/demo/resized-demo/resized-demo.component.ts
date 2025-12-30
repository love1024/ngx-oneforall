import { Component, signal } from '@angular/core';
import {
  ResizedDirective,
  ResizedEvent,
} from 'ngx-oneforall/directives/resized';

@Component({
  selector: 'lib-resized-demo',
  imports: [ResizedDirective],
  template: `
    <div (resized)="resized($event)" class="block">
      <p>Resize the demo pan to see the event in action</p>
      <p><span>Width:</span> {{ domRect()?.width?.toFixed(0) + 'px' }}</p>
    </div>
  `,
  styleUrl: './resized-demo.component.scss',
})
export class ResizedDemoComponent {
  domRect = signal<DOMRectReadOnly | null>(null);

  resized(evt: ResizedEvent) {
    this.domRect.set(evt.current);
  }
}
