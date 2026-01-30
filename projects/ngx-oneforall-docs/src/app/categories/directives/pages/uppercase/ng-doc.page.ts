import { NgDocPage } from '@ng-doc/core';
import { UppercaseDemoComponent } from './demo/uppercase-demo.component';
import DirectivesCategory from '../../ng-doc.category';

const UppercasePage: NgDocPage = {
  title: 'Uppercase',
  mdFile: './index.md',
  demos: { UppercaseDemoComponent },
  category: DirectivesCategory,
};

export default UppercasePage;
