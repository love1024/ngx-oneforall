import { NgDocPage } from '@ng-doc/core';
import PipesCategory from '../../ng-doc.category';
import { TimeAgoDemoComponent } from './demo/time-ago-demo/time-ago-demo.component';

const TimeAgoPipe: NgDocPage = {
  title: 'Time Ago Pipe',
  mdFile: './index.md',
  category: PipesCategory,
  demos: { TimeAgoDemoComponent },
};

export default TimeAgoPipe;
