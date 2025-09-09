import { NgDocPage } from '@ng-doc/core';
import InterceptorsCategory from '../../ng-doc.category';
import { CacheInterceptorServiceComponent } from './demo/cache-interceptor-service.component';

const CacheInterceptor: NgDocPage = {
  title: 'Cache Interceptor',
  mdFile: './index.md',
  category: InterceptorsCategory,
  demos: {
    CacheInterceptorServiceComponent,
  },
};

export default CacheInterceptor;
