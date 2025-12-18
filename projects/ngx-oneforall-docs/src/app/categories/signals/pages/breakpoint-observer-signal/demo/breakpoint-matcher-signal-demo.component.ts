import { Component } from '@angular/core';
import { BREAKPOINT, BREAKPOINT_QUERY } from '@ngx-oneforall/constants';
import { breakpointMatcher } from '@ngx-oneforall/signals';

@Component({
  selector: 'lib-breakpoint-matcher-signal-demo',
  template: `
    <div class="demo-container">
      <h2>Breakpoint Matcher Signal Demo</h2>
      <p>
        Resize your browser window to see how the
        <strong>breakpointMatcher</strong> signal responds in real time.
      </p>
      <div class="result-box" [class.active]="extraSmallDevice()">
        <span>
          <strong>Current Query:</strong>
          <code>{{ BreakpointQueries['xs'] }} </code>
        </span>
        <span>
          <strong>Is Extra Small Device?</strong>
          <span
            [class.yes]="extraSmallDevice()"
            [class.no]="!extraSmallDevice()">
            {{ extraSmallDevice() ? 'Yes' : 'No' }}
          </span>
        </span>
      </div>
      <small>
        <em>
          The result updates automatically as you change the screen size.
        </em>
      </small>
    </div>
  `,
  styleUrl: 'breakpoint-matcher-signal-demo.component.scss',
})
export class BreakpointMatcherSignalDemoComponent {
  BreakpointQueries = BREAKPOINT_QUERY;
  extraSmallDevice = breakpointMatcher(BREAKPOINT.XS);
}
