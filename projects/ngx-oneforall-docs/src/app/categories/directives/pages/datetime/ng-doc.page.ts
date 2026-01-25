import { NgDocPage } from '@ng-doc/core';
import DirectivesCategory from '../../ng-doc.category';
import { DateTimeDemoComponent } from './demo/datetime-demo.component';

const DateTimePage: NgDocPage = {
  title: 'Date Time',
  mdFile: './index.md',
  category: DirectivesCategory,
  demos: {
    DateTimeDemoComponent,
  },
};

export default DateTimePage;
