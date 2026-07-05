import { NgDocPage } from '@ng-doc/core';
import SignalValidatorsCategory from '../../ng-doc.category';
import { MaxDateSignalDemoComponent } from './demo/max-date-demo.component';

const MaxDateSignalPage: NgDocPage = {
  title: 'Max Date',
  mdFile: './index.md',
  category: SignalValidatorsCategory,
  demos: { MaxDateSignalDemoComponent },
};

export default MaxDateSignalPage;
