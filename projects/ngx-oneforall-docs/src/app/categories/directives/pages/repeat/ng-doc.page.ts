import { NgDocPage } from '@ng-doc/core';
import DirectivesCategory from '../../ng-doc.category';
import { RepeatDemoComponent } from './demo/repeat-demo.component';

const RepeatDirective: NgDocPage = {
  title: 'Repeat',
  mdFile: './index.md',
  category: DirectivesCategory,
  demos: {
    RepeatDemoComponent,
  },
};

export default RepeatDirective;
