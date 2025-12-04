import { NgDocPage } from '@ng-doc/core';
import PipesCategory from '../../ng-doc.category';
import { BytesPipeDemoComponent } from './demo/bytes-pipe-demo.component';

const BytesPipe: NgDocPage = {
    title: 'Bytes Pipe',
    mdFile: './index.md',
    category: PipesCategory,
    demos: {
        BytesPipeDemoComponent,
    },
};

export default BytesPipe;
