import { NgDocPage } from '@ng-doc/core';
import ServicesCategory from '../../ng-doc.category';
import { ClipboardDemoComponent } from './demo/clipboard-demo.component';

const ClipboardServicePage: NgDocPage = {
    title: 'Clipboard',
    mdFile: './index.md',
    category: ServicesCategory,
    demos: {
        ClipboardDemoComponent,
    },
};

export default ClipboardServicePage;
