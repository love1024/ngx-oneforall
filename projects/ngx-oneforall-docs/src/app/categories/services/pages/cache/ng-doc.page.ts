import { NgDocPage } from '@ng-doc/core';
import ServicesCategory from '../../ng-doc.category';
import { CacheServiceDemoComponent } from './demo/cache-service-demo.component';

const CacheService: NgDocPage = {
  title: 'Cache',
  mdFile: './index.md',
  category: ServicesCategory,
  demos: {
    CacheServiceDemoComponent,
  },
};

export default CacheService;
