import { NgDocPage } from '@ng-doc/core';
import ServicesCategory from '../../ng-doc.category';
import { LocalStorageServiceDemoComponent } from './demo/local-storage-service-demo.component';
import { LocalStorageTypedServiceDemoComponent } from './demo/local-storage-typed-service-demo.component';

const LocalStorageService: NgDocPage = {
  title: 'Local Storage',
  mdFile: './index.md',
  category: ServicesCategory,
  demos: {
    LocalStorageServiceDemoComponent,
    LocalStorageTypedServiceDemoComponent,
  },
};

export default LocalStorageService;
