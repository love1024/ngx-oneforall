import { NgDocPage } from '@ng-doc/core';
import DirectivesCategory from '../../ng-doc.category';
import { NumberInputDemoComponent } from './demo/number-input-demo.component';

const NumberInputPage: NgDocPage = {
  title: 'Number Input',
  mdFile: './index.md',
  category: DirectivesCategory,
  demos: {
    NumberInputDemoComponent,
  },
};

export default NumberInputPage;
