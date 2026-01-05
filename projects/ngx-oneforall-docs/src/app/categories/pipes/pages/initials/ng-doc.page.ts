import { NgDocPage } from '@ng-doc/core';
import PipesCategory from '../../ng-doc.category';
import { InitialsDemoComponent } from './demo/initials-demo.component';

const Initials: NgDocPage = {
  title: 'Initials',
  mdFile: './index.md',
  category: PipesCategory,
  demos: {
    InitialsDemoComponent,
  },
};

export default Initials;
