import { NgDocPage } from '@ng-doc/core';
import RxjsCategory from '../../ng-doc.category';
import { DebugDemoComponent } from './demo/debug-demo.component';

const DebugPage: NgDocPage = {
  title: `Debug`,
  mdFile: `./index.md`,
  category: RxjsCategory,
  demos: { DebugDemoComponent },
};

export default DebugPage;
