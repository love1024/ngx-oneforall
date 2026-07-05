import { NgDocPage } from '@ng-doc/core';
import SignalValidatorsCategory from '../../ng-doc.category';
import { UrlSignalDemoComponent } from './demo/url-demo.component';

const UrlSignalPage: NgDocPage = {
  title: 'Url',
  mdFile: './index.md',
  category: SignalValidatorsCategory,
  demos: { UrlSignalDemoComponent },
};

export default UrlSignalPage;
