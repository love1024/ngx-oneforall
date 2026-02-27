import { NgDocPage } from '@ng-doc/core';
import DirectivesCategory from '../../ng-doc.category';
import { DraggableDemoComponent } from './demo/draggable-demo/draggable-demo.component';

const DraggableDirectivePage: NgDocPage = {
  title: 'Draggable',
  mdFile: './index.md',
  category: DirectivesCategory,
  demos: {
    DraggableDemoComponent,
  },
};

export default DraggableDirectivePage;
