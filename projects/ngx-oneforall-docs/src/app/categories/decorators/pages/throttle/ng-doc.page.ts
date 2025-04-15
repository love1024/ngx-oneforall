import { NgDocPage } from '@ng-doc/core';
import DecoratorsCategory from '../../ng-doc.category';
import { ThrottleDemoComponent } from './demo/throttle-demo/throttle-demo.component';

const ThrottlePage: NgDocPage = {
  title: 'Throttle',
  mdFile: './index.md', // Link to the Markdown file
  category: DecoratorsCategory,
  demos: {
    ThrottleDemoComponent,
  },
};

export default ThrottlePage;
