import { NgDocPage } from '@ng-doc/core';
import UtilsCategory from '../../ng-doc.category';
import { Base64UrlDemoComponent } from './demo/base64-url-demo/base64-url-demo.component';

const Base64UrlUtil: NgDocPage = {
  title: 'Base64 URL',
  mdFile: './index.md',
  category: UtilsCategory,
  demos: {
    Base64UrlDemoComponent,
  },
};

export default Base64UrlUtil;
