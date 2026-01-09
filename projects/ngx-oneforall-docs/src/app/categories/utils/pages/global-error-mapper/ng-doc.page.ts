import { NgDocPage } from '@ng-doc/core';
import UtilsCategory from '../../ng-doc.category';
import { GlobalErrorMapperDemoComponent } from './demo/global-error-mapper-demo.component';

const GlobalErrorMapperUtil: NgDocPage = {
  title: 'Global Error Mapper',
  mdFile: './index.md',
  category: UtilsCategory,
  demos: {
    GlobalErrorMapperDemoComponent,
  },
};

export default GlobalErrorMapperUtil;
