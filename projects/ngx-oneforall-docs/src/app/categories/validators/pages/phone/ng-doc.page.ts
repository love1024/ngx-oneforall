import { NgDocPage } from '@ng-doc/core';
import ValidatorsCategory from '../../ng-doc.category';
import { PhoneDemoComponent } from './demo/phone-demo.component';

const PhonePage: NgDocPage = {
    title: 'Phone',
    mdFile: './index.md',
    category: ValidatorsCategory,
    demos: { PhoneDemoComponent },
};

export default PhonePage;
