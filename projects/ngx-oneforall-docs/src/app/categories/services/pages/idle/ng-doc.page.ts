import { NgDocPage } from '@ng-doc/core';
import ServicesCategory from '../../ng-doc.category';
import { IdleDemoComponent } from './demo/idle-demo.component';

const IdlePage: NgDocPage = {
  title: 'Idle',
  mdFile: './index.md',
  category: ServicesCategory,
  demos: { IdleDemoComponent },
};

export default IdlePage;
