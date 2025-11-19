import { NgDocPage } from '@ng-doc/core';
import DecoratorsCategory from '../../ng-doc.category';
import { MemoizeDecoratorComponent } from './demo/memoize-decorator-demo.component';

const MemoizePage: NgDocPage = {
  title: 'Memoize',
  mdFile: './index.md',
  category: DecoratorsCategory,
  demos: {
    MemoizeDecoratorComponent,
  },
};

export default MemoizePage;
