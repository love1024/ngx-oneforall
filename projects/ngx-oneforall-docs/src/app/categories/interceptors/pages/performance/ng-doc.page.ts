import { NgDocPage } from '@ng-doc/core';
import InterceptorsCategory from '../../ng-doc.category';
import { PerformanceInterceptorDemoComponent } from './demo/performance-interceptor-demo.component';

const PerformanceInterceptor: NgDocPage = {
  title: 'Performance Interceptor',
  mdFile: './index.md',
  category: InterceptorsCategory,
  demos: {
    PerformanceInterceptorDemoComponent,
  },
};

export default PerformanceInterceptor;
