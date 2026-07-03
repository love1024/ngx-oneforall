import { NgDocPage } from '@ng-doc/core';
import SignalValidatorsCategory from '../../ng-doc.category';
import { NotBlankSignalDemoComponent } from './demo/not-blank-demo.component';

const NotBlankSignalPage: NgDocPage = {
  title: 'Not Blank',
  mdFile: './index.md',
  category: SignalValidatorsCategory,
  demos: { NotBlankSignalDemoComponent },
};

export default NotBlankSignalPage;
