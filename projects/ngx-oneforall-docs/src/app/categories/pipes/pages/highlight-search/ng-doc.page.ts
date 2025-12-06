import { NgDocPage } from '@ng-doc/core';
import PipesCategory from '../../ng-doc.category';
import { HighlightSearchPipeDemoComponent } from './demo/highlight-search-pipe-demo.component';

const HighlightSearchPipe: NgDocPage = {
    title: 'Highlight Search',
    mdFile: './index.md',
    category: PipesCategory,
    demos: {
        HighlightSearchPipeDemoComponent,
    },
};

export default HighlightSearchPipe;
