import { NgDocPage } from '@ng-doc/core';
import DirectivesCategory from '../../ng-doc.category';
import { DragAutoScrollDemoComponent } from './demo/drag-auto-scroll-demo/drag-auto-scroll-demo.component';

const DragAutoScrollDirective: NgDocPage = {
  title: 'Drag Auto Scroll',
  mdFile: './index.md',
  category: DirectivesCategory,
  demos: {
    DragAutoScrollDemoComponent,
  },
};

export default DragAutoScrollDirective;
