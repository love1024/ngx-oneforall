import { NgDocPage } from '@ng-doc/core';
import SignalValidatorsCategory from '../../ng-doc.category';
import { PhoneSignalDemoComponent } from './demo/phone-demo.component';

const PhoneSignalPage: NgDocPage = {
  title: 'Phone',
  mdFile: './index.md',
  category: SignalValidatorsCategory,
  demos: { PhoneSignalDemoComponent },
};

export default PhoneSignalPage;
