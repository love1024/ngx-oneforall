import { NgDocPage } from '@ng-doc/core';
import DirectivesCategory from '../../ng-doc.category';
import { VisibilityChangeDemoComponent } from './demo/visibility-change-demo.component';

const VisibilityChangeDirective: NgDocPage = {
  title: 'Visibility Change',
  mdFile: './index.md',
  category: DirectivesCategory,
  demos: {
    VisibilityChangeDemoComponent,
  },
};

export default VisibilityChangeDirective;
