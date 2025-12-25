import { NgDocPage } from '@ng-doc/core';
import SignalsCategory from '../../ng-doc.category';
import { DeepComputedDemoComponent } from './demo/deep-computed-demo.component';

const DeepComputedPage: NgDocPage = {
  title: 'Deep Computed',
  mdFile: './index.md',
  category: SignalsCategory,
  demos: { DeepComputedDemoComponent },
};

export default DeepComputedPage;
