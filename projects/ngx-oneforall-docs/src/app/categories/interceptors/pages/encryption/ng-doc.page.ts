import { NgDocPage } from '@ng-doc/core';
import InterceptorsCategory from '../../ng-doc.category';
import { EncryptionInterceptorDemoComponent } from './demo/encryption-interceptor-demo.component';

const EncryptionInterceptor: NgDocPage = {
  title: 'Encryption Interceptor',
  mdFile: './index.md',
  category: InterceptorsCategory,
  demos: {
    EncryptionInterceptorDemoComponent,
  },
};

export default EncryptionInterceptor;
