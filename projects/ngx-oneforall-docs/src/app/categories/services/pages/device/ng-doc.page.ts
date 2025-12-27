import { NgDocPage } from '@ng-doc/core';
import ServicesCategory from '../../ng-doc.category';
import { DeviceServiceDemoComponent } from './demo/device-service-demo.component';

const DeviceService: NgDocPage = {
  title: 'Device',
  mdFile: './index.md',
  category: ServicesCategory,
  demos: {
    DeviceServiceDemoComponent,
  },
};

export default DeviceService;
