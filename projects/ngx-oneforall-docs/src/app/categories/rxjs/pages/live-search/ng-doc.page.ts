import { NgDocPage } from '@ng-doc/core';
import RxjsCategory from '../../ng-doc.category';
import { LiveSearchDemoComponent } from './demo/live-search-demo.component';

const LiveSearchPage: NgDocPage = {
    title: 'Live Search',
    mdFile: './index.md',
    category: RxjsCategory,
    demos: { LiveSearchDemoComponent },
};

export default LiveSearchPage;
