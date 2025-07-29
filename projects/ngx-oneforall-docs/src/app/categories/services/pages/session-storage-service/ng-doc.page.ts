import { NgDocPage } from '@ng-doc/core';
import ServicesCategory from '../../ng-doc.category';
import { SessionStorageServiceDemoComponent } from './demo/session-storage-service-demo.component';
import { SessionStorageTypedServiceDemoComponent } from './demo/session-storage-typed-service-demo.component';

const SessionStorageService: NgDocPage = {
  title: 'Session Storage',
  mdFile: './index.md',
  category: ServicesCategory,
  demos: {
    SessionStorageServiceDemoComponent,
    SessionStorageTypedServiceDemoComponent,
  },
};

export default SessionStorageService;
