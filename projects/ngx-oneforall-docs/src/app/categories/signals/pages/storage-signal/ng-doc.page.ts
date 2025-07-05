import { NgDocPage } from '@ng-doc/core';
import SignalsCategory from '../../ng-doc.category';
import { StorageSignalDemoComponent } from './demo/storage-signal-demo.component';

const StorageSignal: NgDocPage = {
  title: 'Storage Signal',
  mdFile: './index.md',
  category: SignalsCategory,
  demos: {
    StorageSignalDemoComponent,
  },
};

export default StorageSignal;
