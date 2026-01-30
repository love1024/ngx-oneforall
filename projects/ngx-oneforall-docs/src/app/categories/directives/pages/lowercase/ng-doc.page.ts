import { NgDocPage } from '@ng-doc/core';
import { LowercaseDemoComponent } from './demo/lowercase-demo.component';
import DirectivesCategory from '../../ng-doc.category';

const LowercasePage: NgDocPage = {
  title: 'Lowercase',
  mdFile: './index.md',
  demos: { LowercaseDemoComponent },
  category: DirectivesCategory,
};

export default LowercasePage;
