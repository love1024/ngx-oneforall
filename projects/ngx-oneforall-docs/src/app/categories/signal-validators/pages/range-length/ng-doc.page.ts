import { NgDocPage } from '@ng-doc/core';
import SignalValidatorsCategory from '../../ng-doc.category';
import { RangeLengthSignalDemoComponent } from './demo/range-length-demo.component';

const RangeLengthSignalPage: NgDocPage = {
  title: 'Range Length',
  mdFile: './index.md',
  category: SignalValidatorsCategory,
  demos: { RangeLengthSignalDemoComponent },
};

export default RangeLengthSignalPage;
