import { NgDocPage } from '@ng-doc/core';
import SignalsCategory from '../../ng-doc.category';
import { BreakpointObserverSignalDemoComponent } from './demo/breakpoint-observer-signal-demo.component';

const BreakpointObserverSignal: NgDocPage = {
  title: 'Breakpoint Observer',
  mdFile: './index.md',
  category: SignalsCategory,
  demos: {
    BreakpointObserverSignalDemoComponent,
  },
};

export default BreakpointObserverSignal;
