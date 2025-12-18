import { NgDocPage } from '@ng-doc/core';
import DecoratorsCategory from '../../ng-doc.category';
import { CatchErrorDemoComponent } from './demo/catch-error-demo.component';

const CatchErrorPage: NgDocPage = {
  title: `Catch Error`,
  mdFile: `./index.md`,
  category: DecoratorsCategory,
  demos: { CatchErrorDemoComponent },
};

export default CatchErrorPage;
