import { NgDocPage } from '@ng-doc/core';
import ServicesCategory from '../../ng-doc.category';
import { CookieServiceDemoComponent } from './demo/cookie-service-demo.component';

const CookieService: NgDocPage = {
  title: 'Cookie Service',
  mdFile: './index.md',
  category: ServicesCategory,
  demos: {
    CookieServiceDemoComponent,
  },
};

export default CookieService;
