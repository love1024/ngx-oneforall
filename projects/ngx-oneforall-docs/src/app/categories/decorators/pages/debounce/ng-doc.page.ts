import { NgDocPage } from '@ng-doc/core';
import DecoratorsCategory from '../../ng-doc.category';
import { DebounceDemoComponent } from './demo/debounce-demo/debounce-demo.component';

const DebouncePage: NgDocPage = {
  title: 'Debounce',
  mdFile: './index.md', // Link to the Markdown file
  category: DecoratorsCategory,
  demos: {
    DebounceDemoComponent,
  },
};

export default DebouncePage;
