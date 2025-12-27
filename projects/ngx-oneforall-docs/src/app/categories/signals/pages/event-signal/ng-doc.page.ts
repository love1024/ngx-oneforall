import { NgDocPage } from '@ng-doc/core';
import SignalsCategory from '../../ng-doc.category';
import { EventSignalDemoComponent } from './demo/event-signal-demo.component';

const EventSignalPage: NgDocPage = {
  title: 'DOM Event',
  mdFile: './index.md',
  category: SignalsCategory,
  demos: { EventSignalDemoComponent },
};

export default EventSignalPage;
