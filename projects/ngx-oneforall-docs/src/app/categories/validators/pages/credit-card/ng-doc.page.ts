import { NgDocPage } from '@ng-doc/core';
import ValidatorsCategory from '../../ng-doc.category';
import { CreditCardDemoComponent } from './demo/credit-card-demo.component';

const CreditCardPage: NgDocPage = {
    title: 'Credit Card',
    mdFile: './index.md',
    category: ValidatorsCategory,
    demos: { CreditCardDemoComponent },
};

export default CreditCardPage;
