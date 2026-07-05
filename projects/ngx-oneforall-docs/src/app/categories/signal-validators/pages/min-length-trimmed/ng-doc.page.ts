import { NgDocPage } from '@ng-doc/core';
import SignalValidatorsCategory from '../../ng-doc.category';
import { MinLengthTrimmedSignalDemoComponent } from './demo/min-length-trimmed-demo.component';

const MinLengthTrimmedSignalPage: NgDocPage = {
  title: 'Min Length Trimmed',
  mdFile: './index.md',
  category: SignalValidatorsCategory,
  demos: { MinLengthTrimmedSignalDemoComponent },
};

export default MinLengthTrimmedSignalPage;
