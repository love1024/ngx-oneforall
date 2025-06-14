import { NgDocPage } from '@ng-doc/core';
import DirectivesCategory from '../../ng-doc.category';
import { ClickThrottleDemoComponent } from './demo/click-throttle-demo.component';

const ClickThrottleDirective: NgDocPage = {
  title: 'Click Throttle',
  mdFile: './index.md',
  category: DirectivesCategory,
  demos: {
    ClickThrottleDemoComponent,
  },
};

export default ClickThrottleDirective;
