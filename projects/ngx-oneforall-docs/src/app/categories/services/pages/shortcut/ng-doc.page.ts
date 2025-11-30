import { NgDocPage } from '@ng-doc/core';
import { ShortcutServiceDemoComponent } from './demo/shortcut-service-demo/shortcut-service-demo.component';
import ServicesCategory from '../../ng-doc.category';

const ShortcutPage: NgDocPage = {
    title: 'Shortcut',
    mdFile: './index.md',
    category: ServicesCategory,
    demos: { ShortcutServiceDemoComponent },
};

export default ShortcutPage;
