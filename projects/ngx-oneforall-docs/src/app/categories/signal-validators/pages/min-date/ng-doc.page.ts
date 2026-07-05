import { NgDocPage } from '@ng-doc/core';
import SignalValidatorsCategory from '../../ng-doc.category';
import { MinDateSignalDemoComponent } from './demo/min-date-demo.component';

const MinDateSignalPage: NgDocPage = {
  title: 'Min Date',
  mdFile: './index.md',
  category: SignalValidatorsCategory,
  demos: { MinDateSignalDemoComponent },
};

export default MinDateSignalPage;
