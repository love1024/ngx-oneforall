import { NgDocPage } from '@ng-doc/core';
import PipesCategory from '../../ng-doc.category';
import { PluralizePipeDemoComponent } from './demo/pluralize-pipe-demo.component';

const PluralizePipe: NgDocPage = {
    title: 'Pluralize Pipe',
    mdFile: './index.md',
    category: PipesCategory,
    demos: {
        PluralizePipeDemoComponent,
    },
};

export default PluralizePipe;
