import { NgDocPage } from '@ng-doc/core';
import ServicesCategory from '../../ng-doc.category';
import { NetworkStatusDemoComponent } from './demo/network-status-demo.component';

const NetworkStatusService: NgDocPage = {
  title: 'Network Status',
  mdFile: './index.md',
  category: ServicesCategory,
  demos: {
    NetworkStatusDemoComponent,
  },
};

export default NetworkStatusService;
