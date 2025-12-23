import { NgDocPage } from '@ng-doc/core';
import GuardsCategory from '../../ng-doc.category';
import { ParamDemoComponent } from './param-demo/param-demo.component';

const ParamGuardPage: NgDocPage = {
  title: 'Param Guard',
  mdFile: './index.md',
  category: GuardsCategory,
  demos: { ParamDemoComponent },
};

export default ParamGuardPage;
