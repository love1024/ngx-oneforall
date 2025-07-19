import { NgDocPage } from '@ng-doc/core';
import SignalsCategory from '../../ng-doc.category';
import { BreakpointMatcherSignalDemoComponent } from './demo/breakpoint-matcher-signal-demo.component';
import { BreakpointMatcherMultipleSignalDemoComponent } from './demo/breakpoint-matcher-multiple-demo.component';

const BreakpointObserverSignal: NgDocPage = {
  title: 'Breakpoint Observer',
  mdFile: './index.md',
  category: SignalsCategory,
  demos: {
    BreakpointMatcherSignalDemoComponent,
    BreakpointMatcherMultipleSignalDemoComponent,
  },
};

export default BreakpointObserverSignal;
