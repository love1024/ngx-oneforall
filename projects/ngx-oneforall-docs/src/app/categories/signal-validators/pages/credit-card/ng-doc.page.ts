import { NgDocPage } from '@ng-doc/core';
import SignalValidatorsCategory from '../../ng-doc.category';
import { CreditCardSignalDemoComponent } from './demo/credit-card-demo.component';

const CreditCardSignalPage: NgDocPage = {
  title: 'Credit Card',
  mdFile: './index.md',
  category: SignalValidatorsCategory,
  demos: { CreditCardSignalDemoComponent },
};

export default CreditCardSignalPage;
