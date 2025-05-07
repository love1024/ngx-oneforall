import { NgDocPage } from '@ng-doc/core';
import PipesCategory from '../../ng-doc.category';
import { TimeAgoDemoComponent } from './demo/time-ago-demo/time-ago-demo.component';
import { TimeAgoCustomClockDemoComponent } from './demo/time-ago-custom-clock-demo/time-ago-custom-clock-demo.component';
import { TimeAgoCustomLabelsDemoComponent } from './demo/time-ago-custom-labels-demo/time-ago-custom-labels-demo.component';

const TimeAgoPipe: NgDocPage = {
  title: 'Time Ago Pipe',
  mdFile: './index.md',
  category: PipesCategory,
  demos: {
    TimeAgoDemoComponent,
    TimeAgoCustomClockDemoComponent,
    TimeAgoCustomLabelsDemoComponent,
  },
};

export default TimeAgoPipe;
