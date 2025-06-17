import { NgDocPage } from '@ng-doc/core';
import DirectivesCategory from '../../ng-doc.category';
import { HoverClassDemoComponent } from './demo/hover-class-demo.component';

const HoverClassDirective: NgDocPage = {
  title: 'Hover Class',
  mdFile: './index.md',
  category: DirectivesCategory,
  demos: {
    HoverClassDemoComponent,
  },
};

export default HoverClassDirective;
