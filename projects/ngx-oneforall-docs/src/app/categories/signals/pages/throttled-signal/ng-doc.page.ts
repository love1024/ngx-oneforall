import { NgDocPage } from '@ng-doc/core';
import SignalsCategory from '../../ng-doc.category';
import { ThrottledSignalDemoComponent } from './demo/throttled-signal-demo.component';

const ThrottledSignalPage: NgDocPage = {
    title: 'Throttled Signal',
    mdFile: './index.md',
    category: SignalsCategory,
    demos: { ThrottledSignalDemoComponent },
};

export default ThrottledSignalPage;
