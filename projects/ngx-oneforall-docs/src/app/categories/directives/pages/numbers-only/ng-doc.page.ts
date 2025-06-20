import { NgDocPage } from '@ng-doc/core';
import DirectivesCategory from '../../ng-doc.category';
import { NumbersOnlyDemoComponent } from './demo/numbers-only-demo.component';

const NumbersOnlyDirective: NgDocPage = {
  title: 'Numbers Only',
  mdFile: './index.md',
  category: DirectivesCategory,
  demos: {
    NumbersOnlyDemoComponent,
  },
};

export default NumbersOnlyDirective;
