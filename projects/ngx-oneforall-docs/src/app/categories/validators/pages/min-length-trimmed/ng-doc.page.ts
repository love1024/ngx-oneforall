import { NgDocPage } from '@ng-doc/core';
import ValidatorsCategory from '../../ng-doc.category';
import { MinLengthTrimmedDemoComponent } from './demo/min-length-trimmed-demo.component';

const MinLengthTrimmedPage: NgDocPage = {
  title: 'Min Length Trimmed',
  mdFile: './index.md',
  category: ValidatorsCategory,
  demos: { MinLengthTrimmedDemoComponent },
};

export default MinLengthTrimmedPage;
