import { NgDocPage } from '@ng-doc/core';
import DirectivesCategory from '../../ng-doc.category';
import { InfiniteScrollDemoComponent } from './demo/infinite-scroll-demo/infinite-scroll-demo.component';

const InfiniteScrollDirective: NgDocPage = {
    title: 'Infinite Scroll',
    mdFile: './index.md',
    category: DirectivesCategory,
    demos: {
        InfiniteScrollDemoComponent,
    },
};

export default InfiniteScrollDirective;
