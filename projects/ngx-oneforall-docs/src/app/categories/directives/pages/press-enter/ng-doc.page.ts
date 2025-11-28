import { NgDocPage } from '@ng-doc/core';
import DirectivesCategory from '../../ng-doc.category';
import { PressEnterDemoComponent } from './demo/press-enter-demo/press-enter-demo.component';

const PressEnterDirective: NgDocPage = {
    title: 'Press Enter',
    mdFile: './index.md',
    category: DirectivesCategory,
    demos: {
        PressEnterDemoComponent,
    },
};

export default PressEnterDirective;
