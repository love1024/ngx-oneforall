import { NgDocPage } from '@ng-doc/core';
import ValidatorsCategory from '../../ng-doc.category';
import { DateDemoComponent } from './demo/date-demo.component';

const DatePage: NgDocPage = {
    title: 'Date',
    mdFile: './index.md',
    category: ValidatorsCategory,
    demos: { DateDemoComponent },
};

export default DatePage;
