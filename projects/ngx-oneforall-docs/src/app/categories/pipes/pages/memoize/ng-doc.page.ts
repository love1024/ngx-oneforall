import { NgDocPage } from '@ng-doc/core';
import PipesCategory from '../../ng-doc.category';
import { MemoizeDemoComponent } from './demo/memoize-demo/memoize-demo.component';

const MemoizePipe: NgDocPage = {
  title: 'Memoize Pipe',
  mdFile: './index.md',
  category: PipesCategory,
  demos: { MemoizeDemoComponent },
};

export default MemoizePipe;
