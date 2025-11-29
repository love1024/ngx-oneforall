import { NgDocPage } from '@ng-doc/core';
import DirectivesCategory from '../../ng-doc.category';
import { ShortcutDemoComponent } from './demo/shortcut-demo/shortcut-demo.component';

const ShortcutDirective: NgDocPage = {
    title: 'Shortcut',
    mdFile: './index.md',
    category: DirectivesCategory,
    demos: {
        ShortcutDemoComponent,
    },
};

export default ShortcutDirective;
