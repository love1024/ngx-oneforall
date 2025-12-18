import { NgDocPage } from '@ng-doc/core';
import { LoadingStatusDemoComponent } from './demo/loading-status-demo.component';
import RxjsCategory from '../../ng-doc.category';

const LoadingStatusPage: NgDocPage = {
  title: `Loading Status`,
  mdFile: `./index.md`,
  category: RxjsCategory,
  demos: { LoadingStatusDemoComponent },
};

export default LoadingStatusPage;
