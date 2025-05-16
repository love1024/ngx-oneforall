import { NgDocPage } from '@ng-doc/core';
import RxJSCategory from '../../ng-doc.category';
import { BackoffRetryDemoComponent } from './demo/backoff-retry-demo.component';

const BackOffRetryOperator: NgDocPage = {
  title: 'Backoff Retry',
  mdFile: './index.md',
  category: RxJSCategory,
  demos: { BackoffRetryDemoComponent },
};

export default BackOffRetryOperator;
