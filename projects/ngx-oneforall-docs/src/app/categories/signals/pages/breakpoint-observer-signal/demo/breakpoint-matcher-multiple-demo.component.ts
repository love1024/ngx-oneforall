import { Component } from '@angular/core';
import { Breakpoint, BreakpointQueries } from '@ngx-oneforall/constants';
import { breakpointMatcherMultiple } from '@ngx-oneforall/signals';

@Component({
  selector: 'lib-breakpoint-matcher-signal-demo',
  template: `
    <div class="demo-container">
      <h2>Breakpoint Matcher Multiple</h2>
      <p>
        Resize your browser window to see how the
        <strong>breakpointMatcher</strong> signal responds in real time.
      </p>
      <div class="result-box" [class.active]="extraSmallorSmallDevice().some">
        <span>
          <strong>Current Query:</strong>
          <code>{{ BreakpointQueries['XS'] }}</code>
          <span>or</span>
          <code>{{ BreakpointQueries['SMOnly'] }}</code>
        </span>
        <span>
          <strong>Is Extra Small or Small Device?</strong>
          <span
            [class.yes]="extraSmallorSmallDevice().some"
            [class.no]="!extraSmallorSmallDevice().some">
            {{ extraSmallorSmallDevice().some ? 'Yes' : 'No' }}
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
export class BreakpointMatcherMultipleSignalDemoComponent {
  BreakpointQueries = BreakpointQueries;
  extraSmallorSmallDevice = breakpointMatcherMultiple([
    Breakpoint.SMOnly,
    Breakpoint.XS,
  ]);
}
