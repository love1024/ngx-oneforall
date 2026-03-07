import { NgDocPage } from '@ng-doc/core';
import DirectivesCategory from '../../ng-doc.category';
import { ShowForDemoComponent } from './demo/show-for-demo.component';

const ShowForDirective: NgDocPage = {
  title: 'Show For',
  mdFile: './index.md',
  category: DirectivesCategory,
  demos: {
    ShowForDemoComponent,
  },
};

export default ShowForDirective;
