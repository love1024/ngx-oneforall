import { NgDocPage } from '@ng-doc/core';
import ValidatorsCategory from '../../ng-doc.category';
import { RangeLengthDemoComponent } from './demo/range-length-demo.component';

const RangeLengthPage: NgDocPage = {
    title: 'Range Length',
    mdFile: './index.md',
    category: ValidatorsCategory,
    demos: { RangeLengthDemoComponent },
};

export default RangeLengthPage;
