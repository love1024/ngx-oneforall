import { NgDocPage } from '@ng-doc/core';
import { ResizedDemoComponent } from './demo/resized-demo/resized-demo.component';
import DirectivesCategory from '../../ng-doc.category';

const ResizedDirective: NgDocPage = {
  title: 'Resized',
  mdFile: './index.md',
  category: DirectivesCategory,
  demos: {
    ResizedDemoComponent,
  },
};

export default ResizedDirective;
