import { NgDocPage } from '@ng-doc/core';
import PipesCategory from '../../ng-doc.category';
import { CallPipeDemoComponent } from './demo/call-pipe-demo.component';

const CallPipe: NgDocPage = {
    title: 'Call Pipe',
    mdFile: './index.md',
    category: PipesCategory,
    demos: {
        CallPipeDemoComponent,
    },
};

export default CallPipe;
