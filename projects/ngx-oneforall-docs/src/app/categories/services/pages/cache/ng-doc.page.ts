import { NgDocPage } from '@ng-doc/core';
import ServicesCategory from '../../ng-doc.category';
import { CacheServiceDemoComponent } from './demo/cache-service-demo.component';

const CookieService: NgDocPage = {
  title: 'Cache Service',
  mdFile: './index.md',
  category: ServicesCategory,
  demos: {
    CacheServiceDemoComponent,
  },
};

export default CookieService;
