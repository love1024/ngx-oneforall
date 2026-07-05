import { NgDocPage } from '@ng-doc/core';
import SignalValidatorsCategory from '../../ng-doc.category';
import { NumberSignalDemoComponent } from './demo/number-demo.component';

const NumberSignalPage: NgDocPage = {
  title: 'Number',
  mdFile: './index.md',
  category: SignalValidatorsCategory,
  demos: { NumberSignalDemoComponent },
};

export default NumberSignalPage;
