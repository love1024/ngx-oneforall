import { NgDocPage } from '@ng-doc/core';
import PipesCategory from '../../ng-doc.category';
import { RangePipeDemoComponent } from './demo/range-pipe-demo.component';

const RangePipe: NgDocPage = {
    title: 'Range Pipe',
    mdFile: './index.md',
    category: PipesCategory,
    demos: {
        RangePipeDemoComponent,
    },
};

export default RangePipe;
