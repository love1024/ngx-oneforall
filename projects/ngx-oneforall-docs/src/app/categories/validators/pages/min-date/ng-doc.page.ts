import { NgDocPage } from '@ng-doc/core';
import ValidatorsCategory from '../../ng-doc.category';
import { MinDateDemoComponent } from './demo/min-date-demo.component';

const MinDatePage: NgDocPage = {
    title: 'Min Date',
    mdFile: './index.md',
    category: ValidatorsCategory,
    demos: { MinDateDemoComponent },
};

export default MinDatePage;
