import { NgDocPage } from '@ng-doc/core';
import ValidatorsCategory from '../../ng-doc.category';
import { NotBlankDemoComponent } from './demo/not-blank-demo.component';

const NotBlankPage: NgDocPage = {
  title: 'Not Blank',
  mdFile: './index.md',
  category: ValidatorsCategory,
  demos: { NotBlankDemoComponent },
};

export default NotBlankPage;
