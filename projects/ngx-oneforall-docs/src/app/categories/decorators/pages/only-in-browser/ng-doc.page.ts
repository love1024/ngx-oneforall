import { NgDocPage } from '@ng-doc/core';
import DecoratorsCategory from '../../ng-doc.category';
import { OnlyInBrowserDemoComponent } from './demo/only-in-browser-demo.component';

const OnlyInBrowserPage: NgDocPage = {
  title: 'Only In Browser',
  mdFile: './index.md',
  category: DecoratorsCategory,
  demos: {
    OnlyInBrowserDemoComponent,
  },
};

export default OnlyInBrowserPage;
