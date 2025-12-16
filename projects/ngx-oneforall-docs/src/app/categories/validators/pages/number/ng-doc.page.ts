import { NgDocPage } from '@ng-doc/core';
import ValidatorsCategory from '../../ng-doc.category';
import { NumberDemoComponent } from './demo/number-demo.component';

const NumberPage: NgDocPage = {
    title: 'Number',
    mdFile: './index.md',
    category: ValidatorsCategory,
    demos: { NumberDemoComponent },
};

export default NumberPage;
