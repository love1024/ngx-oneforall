import { NgDocPage } from '@ng-doc/core';
import InterceptorsCategory from '../../ng-doc.category';
import { TimeoutInterceptorDemoComponent } from './demo/timeout-demo.component';

const TimeoutInterceptorPage: NgDocPage = {
  title: 'Timeout Interceptor',
  mdFile: './index.md',
  category: InterceptorsCategory,
  demos: {
    TimeoutInterceptorDemoComponent,
  },
};

export default TimeoutInterceptorPage;
