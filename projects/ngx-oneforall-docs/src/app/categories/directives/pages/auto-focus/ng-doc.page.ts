import { NgDocPage } from '@ng-doc/core';
import DirectivesCategory from '../../ng-doc.category';
import { AutoFocusDemoComponent } from './demo/auto-focus-demo.component';

const AutoFocusDirective: NgDocPage = {
  title: 'Auto Focus',
  mdFile: './index.md',
  category: DirectivesCategory,
  demos: {
    AutoFocusDemoComponent,
  },
};

export default AutoFocusDirective;
