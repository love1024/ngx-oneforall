import { NgDocPage } from '@ng-doc/core';
import UtilsCategory from '../../ng-doc.category';
import { FileToBase64DemoComponent } from './demo/file-to-base64-demo.component';

const File64Util: NgDocPage = {
  title: 'File to Base64',
  mdFile: './index.md',
  category: UtilsCategory,
  demos: {
    FileToBase64DemoComponent,
  },
};

export default File64Util;
