import { NgDocPage } from '@ng-doc/core';
import GuardsCategory from '../../ng-doc.category';
import { QueryParamDemoComponent } from './query-param-demo/query-param-demo.component';

const QueryParamGuardPage: NgDocPage = {
  title: 'Query Param Guard',
  mdFile: './index.md',
  category: GuardsCategory,
  demos: { QueryParamDemoComponent },
};

export default QueryParamGuardPage;
