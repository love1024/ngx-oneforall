import { NgDocPage } from '@ng-doc/core';
import UtilsCategory from '../../ng-doc.category';
import { SafeSerializeDemoComponent } from './demo/safe-serialize-demo.component';

const SafeSerializeUtil: NgDocPage = {
  title: 'Safe Serialize',
  mdFile: './index.md',
  category: UtilsCategory,
  demos: {
    SafeSerializeDemoComponent,
  },
};

export default SafeSerializeUtil;
