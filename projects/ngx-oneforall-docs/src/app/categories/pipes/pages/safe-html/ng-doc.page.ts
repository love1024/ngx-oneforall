import { NgDocPage } from '@ng-doc/core';
import PipesCategory from '../../ng-doc.category';
import { SafeHtmlPipeDemoComponent } from './demo/safe-html-pipe-demo.component';

const SafeHTMLPipe: NgDocPage = {
  title: 'Safe Html Pipe',
  mdFile: './index.md',
  category: PipesCategory,
  demos: { SafeHtmlPipeDemoComponent },
};

export default SafeHTMLPipe;
