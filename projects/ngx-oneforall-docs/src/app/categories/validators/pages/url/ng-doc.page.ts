import { NgDocPage } from '@ng-doc/core';
import ValidatorsCategory from '../../ng-doc.category';
import { UrlDemoComponent } from './demo/url-demo.component';

const UrlPage: NgDocPage = {
    title: 'Url',
    mdFile: './index.md',
    category: ValidatorsCategory,
    demos: { UrlDemoComponent },
};

export default UrlPage;
