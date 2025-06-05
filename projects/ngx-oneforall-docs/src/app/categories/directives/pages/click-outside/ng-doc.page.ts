import { NgDocPage } from '@ng-doc/core';
import DirectivesCategory from '../../ng-doc.category';
import { ClickOutsideDemoComponent } from './demo/click-outside-demo/click-outside-demo.component';

const ClickOutsideDirective: NgDocPage = {
  title: 'Click Outside',
  mdFile: './index.md',
  category: DirectivesCategory,
  demos: {
    ClickOutsideDemoComponent,
  },
};

export default ClickOutsideDirective;
