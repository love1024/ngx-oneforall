import { NgDocPage } from '@ng-doc/core';
import PipesCategory from '../../ng-doc.category';
import { FirstErrorControlComponent } from './demo/first-error-control.component';
import { FirstErrorValidationComponent } from './demo/first-error-validation.component';

const FirstErrorKeyPipe: NgDocPage = {
  title: 'First Error Key',
  mdFile: './index.md',
  category: PipesCategory,
  demos: { FirstErrorControlComponent, FirstErrorValidationComponent },
};

export default FirstErrorKeyPipe;
