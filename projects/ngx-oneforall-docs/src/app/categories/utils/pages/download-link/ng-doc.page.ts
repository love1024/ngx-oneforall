import { NgDocPage } from '@ng-doc/core';
import UtilsCategory from '../../ng-doc.category';
import { DownloadLinkDemoComponent } from './demo/download-link-demo.component';

const DownloadLinkPage: NgDocPage = {
    title: 'Download Link',
    mdFile: './index.md',
    category: UtilsCategory,
    demos: { DownloadLinkDemoComponent },
};

export default DownloadLinkPage;
