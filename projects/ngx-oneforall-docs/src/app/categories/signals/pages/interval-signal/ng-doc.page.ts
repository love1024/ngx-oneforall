import { NgDocPage } from '@ng-doc/core';
import SignalsCategory from '../../ng-doc.category';
import { IntervalSignalDemoComponent } from './demo/interval-signal-demo.component';

const IntervalSignalPage: NgDocPage = {
    title: 'Interval Signal',
    mdFile: './index.md',
    category: SignalsCategory,
    demos: { IntervalSignalDemoComponent },
};

export default IntervalSignalPage;
