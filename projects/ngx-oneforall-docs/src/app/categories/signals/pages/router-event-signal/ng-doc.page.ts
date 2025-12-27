import { NgDocPage } from '@ng-doc/core';
import SignalsCategory from '../../ng-doc.category';
import { RouterEventSignalDemoComponent } from './demo/router-event-signal-demo.component';

const RouterEventSignalPage: NgDocPage = {
  title: 'Router Event',
  mdFile: './index.md',
  category: SignalsCategory,
  demos: { RouterEventSignalDemoComponent },
};

export default RouterEventSignalPage;
