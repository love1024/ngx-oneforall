import { NgDocPage } from '@ng-doc/core';
import ServicesCategory from '../../ng-doc.category';
import { SessionStorageServiceDemoComponent } from './demo/session-storage-service-demo.component';

const SessionStorageService: NgDocPage = {
  title: 'Session Storage Service',
  mdFile: './index.md',
  category: ServicesCategory,
  demos: {
    SessionStorageServiceDemoComponent,
  },
};

export default SessionStorageService;
