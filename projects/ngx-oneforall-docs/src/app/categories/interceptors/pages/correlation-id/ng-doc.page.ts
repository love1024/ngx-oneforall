import { NgDocPage } from '@ng-doc/core';
import InterceptorsCategory from '../../ng-doc.category';
import { CorrelationIdInterceptorDemoComponent } from './demo/correlation-id-interceptor-demo.component';

const CorrelationIdInterceptor: NgDocPage = {
  title: 'Correlation ID Interceptor',
  mdFile: './index.md',
  category: InterceptorsCategory,
  demos: {
    CorrelationIdInterceptorDemoComponent,
  },
};

export default CorrelationIdInterceptor;
