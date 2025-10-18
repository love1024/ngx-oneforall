import { NgDocPage } from '@ng-doc/core';
import DecoratorsCategory from '../../ng-doc.category';
import { LogExecutionTimeDemoComponent } from './demo/log-execution-time-demo.component';

const LogExecutionTimePage: NgDocPage = {
  title: 'Log Execution Time',
  mdFile: './index.md',
  category: DecoratorsCategory,
  demos: {
    LogExecutionTimeDemoComponent,
  },
};

export default LogExecutionTimePage;
