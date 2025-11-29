import { NgDocPage } from '@ng-doc/core';
import UtilsCategory from '../../ng-doc.category';
import { HostPlatformDemoComponent } from './demo/host-platform-demo/host-platform-demo.component';

const HostPlatformPage: NgDocPage = {
    title: 'Host Platform',
    mdFile: './index.md',
    category: UtilsCategory,
    demos: { HostPlatformDemoComponent },
};

export default HostPlatformPage;
