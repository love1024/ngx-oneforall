import { Component, effect } from '@angular/core';
import { Breakpoint } from '@ngx-oneforall/constants';
import { breakpointMatcherSignal } from '@ngx-oneforall/signals';

@Component({
  selector: 'lib-breakpoint-observer-signal-demo',
  imports: [],
  template: ` <p>breakpoint-observer-signal-demo works!</p> `,
  styleUrl: './breakpoint-observer-signal-demo.component.scss',
})
export class BreakpointObserverSignalDemoComponent {
  mobileDevice = breakpointMatcherSignal(Breakpoint.XS);

  constructor() {
    effect(() => {
      console.log(this.mobileDevice());
    });
  }
}
