import { NgDocPage } from '@ng-doc/core';
import RxjsCategory from '../../ng-doc.category';
import { DataPollingDemoComponent } from './demo/data-polling-demo.component';

const DataPollingPage: NgDocPage = {
    title: 'Data Polling',
    mdFile: './index.md',
    category: RxjsCategory,
    demos: { DataPollingDemoComponent },
};

export default DataPollingPage;
