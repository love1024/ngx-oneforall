import { NgDocPage } from '@ng-doc/core';
import ValidatorsCategory from '../../ng-doc.category';
import { MaxDateDemoComponent } from './demo/max-date-demo.component';

const MaxDatePage: NgDocPage = {
    title: 'Max Date',
    mdFile: './index.md',
    category: ValidatorsCategory,
    demos: { MaxDateDemoComponent },
};

export default MaxDatePage;
