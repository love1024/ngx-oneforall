import { NgDocPage } from '@ng-doc/core';
import ServicesCategory from '../../ng-doc.category';
import { HistoryDemoComponent } from './demo/history-demo.component';

const HistoryPage: NgDocPage = {
  title: 'History',
  mdFile: './index.md',
  category: ServicesCategory,
  demos: { HistoryDemoComponent },
};

export default HistoryPage;
