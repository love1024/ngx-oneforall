import { NgDocPage } from '@ng-doc/core';
import DirectivesCategory from '../../ng-doc.category';
import { MaskDemoComponent } from './demo/mask-demo.component';

const MaskDirectivePage: NgDocPage = {
  title: 'Mask',
  mdFile: './index.md',
  category: DirectivesCategory,
  demos: {
    MaskDemoComponent,
  },
};

export default MaskDirectivePage;
