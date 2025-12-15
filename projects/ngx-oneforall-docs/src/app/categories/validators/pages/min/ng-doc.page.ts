import { NgDocPage } from '@ng-doc/core';
import ValidatorsCategory from '../../ng-doc.category';
import { MinDemoComponent } from './demo/min-demo.component';

const MinPage: NgDocPage = {
    title: 'Min',
    mdFile: './index.md',
    category: ValidatorsCategory,
    demos: { MinDemoComponent },
};

export default MinPage;
