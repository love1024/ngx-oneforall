import { NgDocPage } from '@ng-doc/core';
import ValidatorsCategory from '../../ng-doc.category';
import { RangeDemoComponent } from './demo/range-demo.component';

const RangePage: NgDocPage = {
    title: 'Range',
    mdFile: './index.md',
    category: ValidatorsCategory,
    demos: { RangeDemoComponent },
};

export default RangePage;
