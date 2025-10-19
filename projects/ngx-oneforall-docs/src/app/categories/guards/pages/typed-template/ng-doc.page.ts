import { NgDocPage } from '@ng-doc/core';
import GuardsCategory from '../../ng-doc.category';
import { TypedTemplateGuardDemoComponent } from './demo/typed-template-guard-demo.component';

const TypedTemplateGuard: NgDocPage = {
  title: 'Typed Template Guard',
  mdFile: './index.md',
  category: GuardsCategory,
  demos: { TypedTemplateGuardDemoComponent },
};

export default TypedTemplateGuard;
