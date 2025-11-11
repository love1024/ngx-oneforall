import { NgDocPage } from '@ng-doc/core';
import DecoratorsCategory from '../../ng-doc.category';
import { CacheDecoratorComponent } from './demo/cache-decorator-demo.component';

const CachePage: NgDocPage = {
  title: 'Cache',
  mdFile: './index.md',
  category: DecoratorsCategory,
  demos: {
    CacheDecoratorComponent,
  },
};

export default CachePage;
