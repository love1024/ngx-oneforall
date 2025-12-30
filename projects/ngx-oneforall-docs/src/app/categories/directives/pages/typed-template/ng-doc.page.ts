import { NgDocPage } from '@ng-doc/core';
import DirectivesCategory from '../../ng-doc.category';
import { TypedTemplateDirectiveDemoComponent } from './demo/typed-template-directive-demo.component';

const TypedTemplateDirectivePage: NgDocPage = {
  title: 'Typed Template',
  mdFile: './index.md',
  category: DirectivesCategory,
  demos: { TypedTemplateDirectiveDemoComponent },
};

export default TypedTemplateDirectivePage;
