import { NgDocPage } from '@ng-doc/core';
import SignalValidatorsCategory from '../../ng-doc.category';
import { DateSignalDemoComponent } from './demo/date-demo.component';

const DateSignalPage: NgDocPage = {
  title: 'Date',
  mdFile: './index.md',
  category: SignalValidatorsCategory,
  demos: { DateSignalDemoComponent },
};

export default DateSignalPage;
