import { NgDocPage } from '@ng-doc/core';
import InterceptorsCategory from '../../ng-doc.category';
import { BaseUrlInterceptorDemoComponent } from './demo/base-url-interceptor-demo.component';

const BaseUrlInterceptor: NgDocPage = {
  title: 'Base URL Interceptor',
  mdFile: './index.md',
  category: InterceptorsCategory,
  demos: {
    BaseUrlInterceptorDemoComponent,
  },
};

export default BaseUrlInterceptor;
