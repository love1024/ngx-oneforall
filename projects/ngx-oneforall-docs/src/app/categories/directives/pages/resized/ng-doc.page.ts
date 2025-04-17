import { NgDocPage } from '@ng-doc/core';
import PipesCategory from '../../ng-doc.category';
import { ResizedDemoComponent } from './demo/resized-demo/resized-demo.component';

const ResizedDirective: NgDocPage = {
  title: 'Resized',
  mdFile: './index.md',
  category: PipesCategory,
  demos: {
    ResizedDemoComponent,
  },
};

export default ResizedDirective;
