import { NgDocPage } from '@ng-doc/core';
import RxjsCategory from '../../ng-doc.category';
import { CatchErrorWithFallbackDemoComponent } from './demo/catch-error-with-fallback-demo.component';

const CatchErrorWithFallbackPage: NgDocPage = {
  title: 'Catch Error With Fallback',
  mdFile: './index.md',
  category: RxjsCategory,
  demos: {
    CatchErrorWithFallbackDemoComponent,
  },
};

export default CatchErrorWithFallbackPage;
