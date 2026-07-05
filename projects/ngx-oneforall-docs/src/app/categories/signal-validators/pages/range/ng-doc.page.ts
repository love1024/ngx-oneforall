import { NgDocPage } from '@ng-doc/core';
import SignalValidatorsCategory from '../../ng-doc.category';
import { RangeSignalDemoComponent } from './demo/range-demo.component';

const RangeSignalPage: NgDocPage = {
  title: 'Range',
  mdFile: './index.md',
  category: SignalValidatorsCategory,
  demos: { RangeSignalDemoComponent },
};

export default RangeSignalPage;
