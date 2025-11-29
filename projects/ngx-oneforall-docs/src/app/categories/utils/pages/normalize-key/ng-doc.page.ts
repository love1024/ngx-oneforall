import { NgDocPage } from '@ng-doc/core';
import UtilsCategory from '../../ng-doc.category';
import { NormalizeKeyDemoComponent } from './demo/normalize-key-demo/normalize-key-demo.component';


const NormalizeKeyPage: NgDocPage = {
    title: 'Normalize Key',
    mdFile: './index.md',
    category: UtilsCategory,
    demos: { NormalizeKeyDemoComponent },
};

export default NormalizeKeyPage;
