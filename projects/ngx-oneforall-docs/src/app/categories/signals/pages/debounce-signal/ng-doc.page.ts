import { NgDocPage } from '@ng-doc/core';
import SignalsCategory from '../../ng-doc.category';
import { DebouncedSignalDemoComponent } from './demo/debounced-signal-demo.component';

const DebouncedSignalPage: NgDocPage = {
    title: 'Debounced Signal',
    mdFile: './index.md',
    category: SignalsCategory,
    demos: { DebouncedSignalDemoComponent },
};

export default DebouncedSignalPage;
