import { NgDocPage } from '@ng-doc/core';
import PipesCategory from '../../ng-doc.category';
import { TruncatePipeDemoComponent } from './demo/truncate-pipe-demo.component';

const TruncatePipe: NgDocPage = {
  title: 'Truncate Pipe',
  mdFile: './index.md',
  category: PipesCategory,
  demos: {
    TruncatePipeDemoComponent,
  },
};

export default TruncatePipe;
