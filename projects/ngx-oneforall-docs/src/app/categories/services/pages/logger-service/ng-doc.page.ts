import { NgDocPage } from '@ng-doc/core';
import ServicesCategory from '../../ng-doc.category';
import { LoggerServiceDemoComponent } from './demo/logger-service-demo.component';
import { LoggerServiceCustomDemoComponent } from './demo/logger-service-custom-demo.component';

const LoggerService: NgDocPage = {
  title: 'Logger',
  mdFile: './index.md',
  category: ServicesCategory,
  demos: {
    LoggerServiceDemoComponent,
    LoggerServiceCustomDemoComponent,
  },
};

export default LoggerService;
