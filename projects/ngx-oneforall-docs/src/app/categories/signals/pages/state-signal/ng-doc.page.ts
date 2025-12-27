import { NgDocPage } from '@ng-doc/core';
import SignalsCategory from '../../ng-doc.category';
import { StateSignalDemoComponent } from './demo/state-signal-demo.component';

const StateSignalPage: NgDocPage = {
  title: 'State',
  mdFile: './index.md',
  category: SignalsCategory,
  demos: { StateSignalDemoComponent },
};

export default StateSignalPage;
