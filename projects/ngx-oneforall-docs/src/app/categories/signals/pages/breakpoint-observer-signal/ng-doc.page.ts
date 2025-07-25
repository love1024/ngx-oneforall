import { NgDocPage } from '@ng-doc/core';
import SignalsCategory from '../../ng-doc.category';
import { BreakpointMatcherSignalDemoComponent } from './demo/breakpoint-matcher-signal-demo.component';
import { BreakpointMatcherMultipleSignalDemoComponent } from './demo/breakpoint-matcher-multiple-demo.component';

const BreakpointMatcherSignal: NgDocPage = {
  title: 'Breakpoint Matcher',
  mdFile: './index.md',
  category: SignalsCategory,
  demos: {
    BreakpointMatcherSignalDemoComponent,
    BreakpointMatcherMultipleSignalDemoComponent,
  },
};

export default BreakpointMatcherSignal;
