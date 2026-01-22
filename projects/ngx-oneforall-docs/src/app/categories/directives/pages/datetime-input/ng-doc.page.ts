import { NgDocPage } from '@ng-doc/core';
import DirectivesCategory from '../../ng-doc.category';
import { DateTimeInputDemoComponent } from './demo/datetime-input-demo.component';

const DateTimeInputPage: NgDocPage = {
  title: 'DateTime Input',
  mdFile: './index.md',
  category: DirectivesCategory,
  demos: {
    DateTimeInputDemoComponent,
  },
};

export default DateTimeInputPage;
