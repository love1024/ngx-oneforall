import { NgDocPage } from '@ng-doc/core';
import PipesCategory from '../../ng-doc.category';
import { MaskPipeDemoComponent } from './demo/mask-pipe-demo.component';

const MaskPipePage: NgDocPage = {
  title: 'Mask Pipe',
  mdFile: './index.md',
  category: PipesCategory,
  demos: {
    MaskPipeDemoComponent,
  },
};

export default MaskPipePage;
